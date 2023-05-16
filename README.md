# WorldBank eBanking Application
React frontend for eBanking Web App.

The web app can be used to:
- Create a new user account for an existing or new customer;
- Bank account operations:
    * Open checking, savings or credit bank accounts;
    * Customize bank account name;
    * View bank account details;
    * Close checking or savings accounts;
- Card operations:
    * Create and attach a virtual card to an existing checking or credit account (CHF or EUR);
    * Block a card;
    * View card details;
- Initiate payments (transactions):
    * Payments to own accounts;
    * Payments to other accounts;
    * Exchange currency;
    * Reimburse - transfer money from CHF checking account to credit account;
- View transactions with time intervals;
- Change user account password.

The REST API responsible for the requests can be found at https://github.com/andreeadracovita/ebanking-rest-api.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all project dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.