import { _deleteOne, _getOne, _updateOne, _getAll, _createOne, createOne } from '../database';
import { MongoClient, ObjectId } from 'mongodb';
import {
    DeleteOneOptions,
    UpdateObject,
    UpdateOneOptions,
    GetAllOptions,
    GetOneOptions,
    FilterObject,
    CreateObject,
    CreateOneOptions,
} from '../types/index';
import { NextFunction, Response } from 'express';

const db = new MongoClient('mongodb://localhost');
let dbInstance;
db.connect().then((db) => (dbInstance = db));

// usage example
interface User extends Document {
    _id: ObjectId;
    usernane: string;
}

// update user
const updateObject: UpdateObject<User> = { $set: {} };
const updateOptions: UpdateOneOptions<User> = {
    returnedMessage: 'User updated successfully',
    returnNew: true,
    filter: { _id: new ObjectId('5f19552a66931921481680c5') },
};

if (dbInstance) {
    _updateOne<User>('users', dbInstance, updateObject, updateOptions);
}

// delete user
const deleteOptions: DeleteOneOptions<User> = {
    returnedMessage: 'User deleted successfully',
    filter: { _id: new ObjectId('5f19552a66931921481680c5') },
};

if (dbInstance) {
    _deleteOne<User>('users', dbInstance, deleteOptions);
}

// get all users

const getAllOptions: GetAllOptions<User> = {
    filter: {},
    returnedMessage: 'Users retrieved successfully',
    page: 1,
    limit: 10,
    sort: { _id: -1 },
    lookup: {
        local_field: '_id',
        foreign_collection: 'Roles',
        foreign_field: '_id',
        as: 'roleDetails',
    },
};

if (dbInstance) {
    _getAll<User>('users', dbInstance, getAllOptions);
}

// get one

if (dbInstance) {
    _getOne<User>('users', dbInstance, {
        filter: { _id: new ObjectId() },
        returnedMessage: 'Users retrieved successfully',
        lookup: {
            local_field: '_id',
            foreign_collection: 'Roles',
            foreign_field: '_id',
            as: 'roleDetails',
        },
    });
}

// create new user

const createObject: CreateObject<User> = {};
const createOptions: CreateOneOptions<User> = {
    returnedMessage: 'User created successfully',
};
