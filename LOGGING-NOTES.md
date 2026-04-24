# PDF Log Folder

This project saves a log entry whenever a user generates the PDF from the app.

Log files are created automatically in the `logs` folder:

- `logs/pdf-edit-logs.csv`
- `logs/pdf-edit-logs.jsonl`

Each log entry includes:

- timestamp
- name
- roll number
- action
- PDF file name
- browser user-agent
- IP address if provided by the server/proxy

Important: this logging runs when the app is running through the Next.js server. It does not run if the page is exported as a fully static HTML file.
