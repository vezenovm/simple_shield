import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, utils } from "ethers";

// contract
let [Verifier, PrivateTransfer]: ContractFactory[] = [];
let [verifier, privateTransfer]: Contract[] = [];
let signers: SignerWithAddress[];

before(async () => {
    Verifier = await ethers.getContractFactory("plonk_vk");
    PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
    signers = await ethers.getSigners();
  });