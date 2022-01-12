const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const {abi, evm} = require('./compile')
const dotenv = require('dotenv');
dotenv.config();

// ADD mnemonics and rinkeby API for your account
const provider = new HDWalletProvider(
    `${process.env.MNEMONIC}`,
    `${process.env.RINKEBY_API}`
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log('Account deploying: ', accounts[0])

    const res = await new web3.eth.Contract(abi)
                .deploy({data: evm.bytecode.object, arguments: ['Hello']})
                .send({gas: '1000000', from: accounts[0]})
    console.log('Contract deployed here: ', res.options.address)
    provider.engine.stop()
}

deploy()
