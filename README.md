# Student Portal (React)

Student part of the Results and Registration Approval System. Runs on sample data.

## Run
```
npm install
npm run dev
```
Open the address shown. Log in with any registration number and password (demo).

## Pages
Login, Dashboard, Unit registration, Fee status, Exam eligibility + exam card, Results,
Issues (report and track), Notifications, AI Assistant, Profile.

## Connect your backend
- Data and actions live in `src/store/StudentContext.jsx`. Replace the sample data with API calls.
- Rules are in `src/utils/rules.js`. They give instant feedback only. The server must repeat every rule
  (programme check, deadline, credit limit, clash, eligibility, published-only results) and log each action.
- The AI advisor (`src/utils/aiAdvisor.js`) is rule-based. For a real AI, call your backend, which calls the AI.
  Never put an AI API key in React.
- Real login, password change and "only my own data" must be enforced by the server.

## Colours
Kisii University palette in `src/styles.css` (:root variables).
