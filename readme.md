# Chat App for Flight Information

## Introduction

This application is a chatbot designed to provide users with real-time flight information. It leverages external APIs and a service account for secure access to flight data, offering a seamless chat experience for users seeking flight details.

## Getting Started

Follow these steps to set up and run the application:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Create a Service Account

-   Go to your cloud provider's console (e.g., Google Cloud Console).
-   Create a new service account with the necessary permissions for accessing flight information APIs.
-   Download the service account credentials as a JSON file.

### 3. Add Credentials

-   Create a folder named `credentials` in the project root if it doesn't exist.
-   Place the downloaded JSON credentials file inside the `credentials` folder.

### 4. Configure Environment Variables

-   Create a `.env` file in the project root.
-   Add the following variables, replacing the placeholders with your actual values:

    ```
    GOOGLE_APPLICATION_CREDENTIALS=credentials/<your-credentials-file>.json
    PROJECT_ID=<your-project-id>
    ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Start the Application

```bash
npx nodemon server.js
```

The server should now be running, and you can interact with the chatbot for flight information.

## Dialogflow ES Integration

To enable natural language understanding, integrate Dialogflow ES with your project:

### 1. Create an Agent

-   In the Google Cloud Console, go to Dialogflow ES.
-   Create a new agent within your project.

### 2. Define and Train Intents

#### Intent 1: Default Welcome Intent

-   **Training Phrases:** "Hi", "Hello", "Hey"
-   **Response:** "Welcome! Would you like to book a flight?"
-   **Output Context:** `booking_data` (lifespan: 5)

#### Intent 2: BookFlight

-   **Training Phrases:** "Book a flight", "I want to fly", "Flight booking"
-   **Parameters:**
    -   `origin` (`@sys.geo-city`)
    -   `destination` (`@sys.geo-city`)
    -   `passengers` (`@sys.number`)
    -   `class` (`@sys.flight-class`)  
        (Set all as required, but disable prompts)
-   **Response:** (Leave empty, handled by webhook)
-   **Output Context:** `booking_data`

#### Intent 3: BookingStep

-   **Input Context:** `booking_data`
-   **Training Phrases:**
    -   "From origin"
    -   "To destination"
    -   "For passengers people"
    -   "class class"
-   **Parameters:** `origin`, `destination`, `passengers`, `class` (not required)
-   **Response:** (Handled by webhook)

#### Intent 4: Confirmation

-   **Input Context:** `booking_data`
-   **Training Phrases:** "Yes", "No", "Confirm", "Cancel"
-   **Parameters:** `confirmation` (`@sys.boolean`)
-   **Response:** (Handled by webhook)

### 3. Enable Fulfillment

-   In Dialogflow ES, go to the Fulfillment section.
-   Enable the webhook.

### 4. Expose Local Server with Ngrok

-   Install ngrok globally:
    ```bash
    npm i -g ngrok
    ```
-   Start ngrok to expose your local server:
    ```bash
    ngrok http 3000
    ```
-   Copy the generated ngrok URL.

### 5. Set Webhook URL in Dialogflow

-   In the Fulfillment section, paste your ngrok URL followed by `/webhook` (e.g., `https://<ngrok-id>.ngrok.io/webhook`).

## Project Folder Structure

Below is the recommended folder structure for the chat app, along with a brief description of each file and directory:

```
chat-app/
├── credentials/                # Stores service account credentials (JSON file)
│   └── <your-credentials-file>.json
├── node_modules/               # Installed npm dependencies
├── src/                        # Source code for the application
│   ├── bot/                    # Chatbot logic and Dialogflow integration
│   │   └── dialogflow.js       # Handles Dialogflow ES requests and responses
│   ├── api/                    # External API integrations (e.g., flight info)
│   │   └── flights.js          # Functions to fetch and process flight data
│   ├── routes/                 # Express route handlers
│   │   └── webhook.js          # Webhook endpoint for Dialogflow fulfillment
│   └── utils/                  # Utility/helper functions
│       └── logger.js           # Logging utility
├── .env                        # Environment variables (not committed to version control)
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Exact dependency versions
├── server.js                   # Main entry point; starts the Express server
└── readme.md                   # Project documentation (this file)
```

### File/Folder Descriptions

-   **credentials/**: Contains your cloud service account credentials (keep this secure and out of version control).
-   **src/bot/dialogflow.js**: Manages communication with Dialogflow ES, processes intents, and handles responses.
-   **src/api/flights.js**: Contains logic to interact with external flight information APIs.
-   **src/routes/webhook.js**: Defines the webhook endpoint that Dialogflow ES calls for fulfillment.
-   **src/utils/logger.js**: Provides logging functionality for debugging and monitoring.
-   **server.js**: Initializes the Express server and sets up middleware and routes.
-   **.env**: Stores sensitive configuration like API keys and project IDs.
-   **package.json / package-lock.json**: Define project dependencies and scripts.
-   **readme.md**: Documentation and setup instructions.

> **Note:** Adjust the folder structure as needed for your project. Keep credentials and sensitive files out of version control.
