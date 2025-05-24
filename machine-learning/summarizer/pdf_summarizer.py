import pdfplumber
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class PDFSummarizer:
    """
    Extract teks dari PDF, chunking per‐chunk sehingga panjang
    (dalam token) ≤ max_position_embeddings, lalu generate summary.
    """

    def __init__(self, model_name: str = "facebook/bart-large-cnn"):
        # 1) load tokenizer & model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        # 2) pilih device
        self.device = torch.device("cuda" if torch.cuda.is_available()
                                   else "cpu")
        self.model.to(self.device)

        # 3) ketahui batas input model (biasanya 1024)
        self.max_input_len = self.tokenizer.model_max_length
        #  berapa banyak special tokens (<s>,</s>) yang akan ditambahkan
        self.special_tokens = self.tokenizer.num_special_tokens_to_add(
            pair=False
        )
        #  ukuran chunk tanpa special tokens
        self.chunk_size = self.max_input_len - self.special_tokens

    def extract_text(self, pdf_path: str) -> str:
        """Baca semua halaman dan gabungkan teksnya."""
        pages = []
        with pdfplumber.open(pdf_path) as pdf:
            for p in pdf.pages:
                t = p.extract_text()
                if t:
                    pages.append(t)
        return "\n".join(pages)

    def _chunk_ids(self, text: str):
        """
        Encode teks jadi list of token‐ID (tanpa special tokens), lalu
        bagi setiap self.chunk_size. Kembalikan tiap chunk sudah
        dibungkus special tokens.
        """
        # encode seluruh teks (tanpa special tokens)
        all_ids = self.tokenizer.encode(text, add_special_tokens=False)
        for i in range(0, len(all_ids), self.chunk_size):
            sub_ids = all_ids[i : i + self.chunk_size]
            # tambahkan special tokens (<s> … </s>) kembali
            input_ids = self.tokenizer.build_inputs_with_special_tokens(
                sub_ids
            )
            # clamp: seandainya masih lebih panjang, potong paksa
            if len(input_ids) > self.max_input_len:
                input_ids = input_ids[: self.max_input_len]
            yield input_ids

    def _summarize_ids(self,
                       input_ids: list[int],
                       max_length: int = 512,
                       min_length: int = 30) -> str:
        """
        Generate summary dari satu chunk token‐ID.
        """
        x = torch.tensor([input_ids], device=self.device)
        mask = (x != self.tokenizer.pad_token_id).long()

        out = self.model.generate(
            input_ids=x,
            attention_mask=mask,
            max_length=max_length,
            min_length=min_length,
            no_repeat_ngram_size=3,
            early_stopping=True
        )
        return self.tokenizer.decode(
            out[0],
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True
        )

    def summarize_pdf(self,
                      pdf_path: str,
                      max_length: int = 512,
                      min_length: int = 30) -> str:
        """
        1) extract → 2) chunk → 3) summary tiap chunk → 4) join
        """
        text = self.extract_text(pdf_path)
        summaries = []
        for chunk_ids in self._chunk_ids(text):
            # debug: cek panjang chunk
            print(f"Chunk with {len(chunk_ids)} tokens → summarizing...")
            summaries.append(
                self._summarize_ids(chunk_ids,
                                    max_length=max_length,
                                    min_length=min_length)
            )
        return "\n\n".join(summaries)