//modulos externos
//const inquirer = require('inquirer')
import inquirer from 'inquirer';
//const chalk = require('chalk')
import chalk from 'chalk';

//modulos internos
import fs from 'fs';

operation()

function operation() {

    inquirer
    .prompt([
        {
        type: 'list',
        name: 'action',
        message: 'O que voce deseja fazer?',
        choices: [
            'criar conta',
            'consultar saldo',
            'depositar',
            'levantar',
            'sair',
        ],
    },
])
.then((answer) => {
    const action = answer ['action']
    if(action === 'criar conta'){
        createAccount()
    } else if(action ==='depositar'){
        deposit()
    }else if(action ==='consultar saldo'){
        getAccountBalance()
    }else if(action ==='levantar'){
        withdraw()
    }else if(action ==='sair'){
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
        process.exit()
    }
})
.catch ((err) => console.log (err))
}

//create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:'
        }
    ]).then(answer => {
       const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(
                chalk.bgRed.black('Esta conta já existe, por favor escolha outro nome!'),
            )
            buildAccount()
            return
        }

        fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance":0}',
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green('Parabéns a sua conta foi criada!'))
    operation()
    })
    .catch(err => console.log(err))
}

//add an amount to user account
function deposit() {

inquirer.prompt([
    {
        name: 'accountName',
        message:'Qual o nome da sua conta?'
    }
])    
.then((answer) => {
    const accountName = answer['accountName']

    //verify if account exists
    if(!checkAccount(accountName)) {
        return deposit()
    }
    inquirer.prompt([
        {
            name: 'amount',
            message: 'Quanto você quer depositar?'
        },
    ]).then((answer) => {
        const amount = answer['amount']
        addAmount(accountName, amount)
    
    }).catch(err => console.log(err))
})
    .catch(err => console.log(err))
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente mais uma vez!'))
        return false
    }
    return true
}

function addAmount(accountName, amount){
    const account = getAccount(accountName)
    
    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }
    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado ${amount}€ na sua conta.`))
    operation()
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

//show account balance

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message:'Qual o nome da sua conta?'
        }
    ]).then(answer => {
        const accountName = answer['accountName']
 
         if(!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const account = getAccount(accountName)

        console.log(chalk.bgWhite.black(
            `O saldo da sua conta é ${account.balance}€.`,
        ),
    )
operation()

    }).catch(err => console.log(err))
}

function withdraw () {

    inquirer.prompt([
        {
            name: 'accountName',
            message:'Qual o nome da sua conta?'
        }
    ]).then(answer => {
        const accountName = answer['accountName']
 
         if(!checkAccount(accountName)) {
            return withdraw()
        }

        const account = getAccount(accountName)
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você quer levantar?'
            },
        ]).then((answer) => {
            const amount = answer['amount']
            subAmount(accountName, amount)
        
        }).catch(err => console.log(err))
    })

    .catch(err => console.log(err))

}

function subAmount(accountName, amount){
    const account = getAccount(accountName)
    
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return subAmount()
    } else if(amount>account.balance){
        console.log(chalk.bgRed.black('Lamentamos, seu saldo não é suficiente!'))
        return operation()
    }
    account.balance = parseFloat(account.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi levantado ${amount}€ da sua conta.`))
    operation()
}
