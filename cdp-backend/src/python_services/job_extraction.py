import re
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the pre-trained model and tokenizer
model_name = "dbmdz/bert-large-cased-finetuned-conll03-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

# Create a Named Entity Recognition (NER) pipeline
nlp = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

app = Flask(__name__)
CORS(app)

def extract_job_info(job_ad_text):
    ner_results = nlp(job_ad_text)

    # Initialize extraction dictionary
    extracted_info = {
        "company_name": None,
        "title": None,
        "job_type": None,
        "no_of_openings": None,
        "qualification_req": None,
        "job_description": None,
        "responsibilities": None,
        "location": None
    }

    # Pre-process text to remove unnecessary newlines and spaces
    job_ad_text = re.sub(r'\n+', '\n', job_ad_text).strip()

    # Extract the job title
    job_title_match = re.search(r'(?:(?:Job\s*Title|Position)[:\- ]+)?([^\n]+(?:Developer|Engineer|Intern|Manager|Lead|Consultant|Designer|Analyst|Architect)[^\n]*)', job_ad_text, re.IGNORECASE)
    if job_title_match:
        extracted_info["title"] = job_title_match.group(1).strip()

    # Extract the company name
    company_name_match = re.search(r'Company[:\- ]+(.+?)(?=\n)', job_ad_text, re.IGNORECASE)
    if company_name_match:
        extracted_info["company_name"] = company_name_match.group(1).strip()
    else:
        company_name_match = re.search(r'@([a-zA-Z0-9.-]+)', job_ad_text)
        if company_name_match:
            company_name_parts = company_name_match.group(1).split('.')
            extracted_info["company_name"] = company_name_parts[0].capitalize()

    # Extract location using NER
    location = []
    for entity in ner_results:
        entity_text = entity["word"].replace("##", "")
        if entity["entity_group"] == "LOC":
            location.append(entity_text)
    if location:
        extracted_info["location"] = " ".join(sorted(set(location), key=location.index)).strip()

    # Extract job type based on keywords in the text
    job_type_match = re.search(r'\b(Remote|Onsite|Hybrid|Full Time|Part Time|Full-time|On-Site)\b', job_ad_text, re.IGNORECASE)
    if job_type_match:
        extracted_info["job_type"] = job_type_match.group(0).strip()

    # Extract responsibilities
    responsibilities_match = re.search(r'(Key Responsibilities|Responsibilities)[:\- ]+([\s\S]+?)(?=(Requirements|Qualifications|Skills|$))', job_ad_text, re.IGNORECASE)
    if responsibilities_match:
        extracted_info["responsibilities"] = responsibilities_match.group(2).strip()

    # Extract qualifications
    qualifications_match = re.search(r'(Requirements|Qualifications|Eligibility Criteria)[:\- ]+([\s\S]+?)(?=(Responsibilities|Skills|$))', job_ad_text, re.IGNORECASE)
    if qualifications_match:
        extracted_info["qualification_req"] = qualifications_match.group(2).strip()

    # Extract job description based on job title
    if extracted_info["title"]:
        extracted_info["job_description"] = f"{extracted_info['title']}"

    return extracted_info

@app.route('/api/v1/jobs/extract', methods=['POST'])
def extract_job_info_route():
    data = request.json
    job_ad_text = data.get('job_ad_text', '')
    extracted_info = extract_job_info(job_ad_text)

    # Print extracted information to the console for debugging
    print("Extracted Information:")
    for key, value in extracted_info.items():
        print(f"{key}: {value}")

    return jsonify(extracted_info)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
