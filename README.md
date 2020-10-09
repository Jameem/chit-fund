# ChitFund

Chitfunds are collection of money from specific number of people in specific installments. At the end of each installment a random winner 
is picked and transfered the money. This is run by a central authority can cause scams. Avoiding the central authority
and using smart contract for storing the money and distributing will diminish the fraudulent activities and expenses for the
central authority.

## How the application work

User is allowed to create Chitfunds and participants can join up to a defined limit. Each participant can pay his installment and after all
participants are paid, smart contract picks the winner for the current installment and transfers the money to his wallet. After the transfer
collection against the next installment is started.

Smart contract is developed in solidity, compiled by solc and deployed to Rinkeby network using web3.js. NodeJs is used on the server, ReactJs on the front-end along with NextJs. 

## Dependencies

Install these prerequisites to follow along,

- NPM: https://nodejs.org
- Metamask: https://metamask.io/

### Step 1. Clone the project

```
git clone https://github.com/Jameem/chit-fund.git
```
### Step 2. Install dependencies

```
$ cd chit-fund
$ npm install
```
### Step 3. Configure metamask and select Rinkeby Test Network

### Step 4. Run the Front End Application

```
$ node server.js Visit this URL in your browser: http://localhost:3000
```

