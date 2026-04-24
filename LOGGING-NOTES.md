# PDF Logging Notes

Is version me PDF generation aur logging ko separate kar diya gaya hai.

- PDF open/print ke liye password nahi lagega.
- PDF edit/modify ke liye owner password required rahega: `B@sit0786`.
- Jab user **Download PDF** press karega, app `/api/log` par POST request bhej kar log save karegi.
- Logs default yahan save honge:
  - `logs/pdf-edit-logs.csv`
  - `logs/pdf-edit-logs.jsonl`

## Zaroori baat

Logging tabhi kaam karegi jab app Next.js server ke through chal rahi ho:

```bash
npm install
npm run dev
```

Phir browser me app open karein:

```text
http://localhost:3000
```

Agar app ko direct HTML file ki tarah open kiya, static hosting par upload kiya, ya aisi hosting par chalaya jahan Node.js API routes nahi chaltay, to PDF download ho jayegi lekin server log file nahi banegi.

## Check

Browser me ye URL open kar ke API check kar sakte hain:

```text
http://localhost:3000/api/log
```

Agar JSON response aaye to logging API theek chal rahi hai.
