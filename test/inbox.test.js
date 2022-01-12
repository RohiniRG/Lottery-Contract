// For testing
const assert = require('assert')

// Our local testnet to test our contracts
const ganache = require('ganache-cli')

// Web3 is a constructor function so thats why it is capitalized
const Web3 = require('web3')

// Getting the interface and bytecode from the compiled file exports
const {abi, evm} = require('../compile')

// We pass a provider, here provider for testnet ganache
const web3 = new Web3(ganache.provider())

let fetchedAccounts
let contract

beforeEach(async () => {
    // To fetch the unlocked (accounts that do not require public and private keys)
    // can also use promise .then() but, async await makes it looks like sync code
    fetchedAccounts = await web3.eth.getAccounts() 

    // deploying the compiled contract's bytecode with its interface from a fetched account 
    contract =  await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object, arguments: ['Hi there']}) // list of arguments to pass to the constructor 
        .send({from: fetchedAccounts[0], gas: '1000000'})
})

describe('Inbox', () => {
    it ('deploys contract', () => {
        // test passes only if it returns a truthy value
        assert.ok(contract.options.address)
    })

    it ('has a default message', async () => {
        // Calling the message variable's getter method from the contract
        const msg = await contract.methods.message().call()
        assert.equal(msg, 'Hi there')
    })

    it ('changes the message', async () => {
        await contract.methods.setMessage('Bye').send({from: fetchedAccounts[0]})
        const msg = await contract.methods.message().call()
        assert.equal(msg, 'Bye')
    })
})
