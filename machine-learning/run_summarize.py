import argparse
from summarizer.pdf_summarizer import PDFSummarizer

def main():
    parser = argparse.ArgumentParser(
        description="Summarize a PDF via facebook/bart-large-cnn"
    )
    parser.add_argument("pdf", help="Path ke file PDF")
    parser.add_argument("-o", "--output",
                        help="Path simpan ringkasan",
                        default=None)
    args = parser.parse_args()

    summ = PDFSummarizer()
    summary = summ.summarize_pdf(args.pdf)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(summary)
        print(f"Ringkasan tersimpan di {args.output}")
    else:
        print(summary)

if __name__ == "__main__":
    main()
