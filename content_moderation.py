import re
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

def load_data(csv_file_path):
    try:
        df = pd.read_csv(csv_file_path)
    except pd.errors.EmptyDataError:
        print("Error: The CSV file is empty.")
        exit()

    df = df.dropna(subset=['text', 'label'])
    return df['text'].tolist(), df['label'].tolist()

def preprocess_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text.lower()

def train_classifier(texts, labels):
    vectorizer = CountVectorizer()
    classifier = MultinomialNB()

    preprocessed_texts = [preprocess_text(str(text)) for text in texts]
    X = vectorizer.fit_transform(preprocessed_texts)
    classifier.fit(X, labels)
    return vectorizer, classifier

def predict_text(text, vectorizer, classifier):
    preprocessed_text = preprocess_text(str(text))
    X = vectorizer.transform([preprocessed_text])
    prediction = classifier.predict(X)
    return prediction[0]

def main():
    csv_file_path = 'dataset.csv'

    training_texts, training_labels = load_data(csv_file_path)
    vectorizer, classifier = train_classifier(training_texts, training_labels)

    while True:
        test_text = input("Text: ")
        if test_text.lower() != "exit":
            prediction = predict_text(test_text, vectorizer, classifier)
 
            if prediction == 1:
                print("The text is health-related.\n")
            else:
                print("The text is not health-related.\n")
        else:
            break

if __name__ == "__main__":
    main()
    