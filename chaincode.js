/*
 * Copyright Arabyka Consultores Associados. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class BatchRegister extends Contract {

    // CreateBatch issues a new batch to the world state with given details.
    async CreateBatch(id, identification, fabrication_date, expiration_date, quantity, external_identifier, product_reference,async_process) {
        const exists = await this.BatchExists(ctx, identification);
        if (exists) {
            throw new Error(`The batch ${id} already exists`);
        }

        const batch = {
            id:id,
            identification: identification,
            fabrication_date: fabrication_date,
            expiration_date: expiration_date,
            quantity: quantity,
            external_identifier: external_identifier,
            product_reference: product_reference,
            async_process: async_process
        };
        
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(batch))));
        return JSON.stringify(batch);
    }

    // ReadBatch returns the batch stored in the world state with given id.
    async ReadBatch(ctx, id) {
        const batchJSON = await ctx.stub.getState(id); // get the batch from chaincode state
        if (!batchJSON || batchJSON.length === 0) {
            throw new Error(`The batch ${id} does not exist`);
        }
        return batchJSON.toString();
    }

}

module.exports = BatchRegister;