const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
web3 = new Web3(ganache.provider())
const { abi, evm } = require('../compile')

let lottery
let fetchedAccounts

beforeEach(async () => {
    fetchedAccounts = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, })
        .send({ from: fetchedAccounts[0], gas: '1000000' })
})

describe('Lottery contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('allows an account to enter', async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        })

        assert.equal(fetchedAccounts[0], players[0])
        assert.equal(1, players.length)
    })

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })

        await lottery.methods.enter().send({
            from: fetchedAccounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })

        await lottery.methods.enter().send({
            from: fetchedAccounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        })

        assert.equal(fetchedAccounts[0], players[0])
        assert.equal(fetchedAccounts[1], players[1])
        assert.equal(fetchedAccounts[2], players[2])
        assert.equal(3, players.length)
    })

    it('requires more than 0.01 ethers to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: fetchedAccounts[0],
                value: 10
            })
            assert(false) // fails test
        } catch (err) {
            assert(err)
        }
    })

    it('only manager can pick winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: fetchedAccounts[1]
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('sends price money and resets players array', async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        const initialBalance = await web3.eth.getBalance(fetchedAccounts[0])

        await lottery.methods.pickWinner().send({
            from: fetchedAccounts[0]
        })

        const finalBalance = await web3.eth.getBalance(fetchedAccounts[0])
        const diff = finalBalance - initialBalance
        assert(diff > web3.utils.toWei('1.8', 'ether'))
    })
})
