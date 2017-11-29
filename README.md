# Prototype_FYP
Prototype for the Final Year Project

## Prerequisites
1. Install MongoDB
2. Create a database called `mongo` in the MongoDB server
3. Create a collection called `accounts` in the `mongo` database
4. Insert `accounts.json` from the root of the repo in the `accounts` collection
5. Install AWS CLI and configure it (`aws configure`)
6. Create a Ubuntu instance with Docker installed and name the private key `MongoDB_1`
7. Add all inbound TCP ports to the security group of the instance
8. Add the following tags to the EC2 instance:
```sh
    serverID: 2
    singleNode: 1
```
9. Create a directory in `connection-manager/server/` called `keys`
10. Copy `MongoDB_1.pem` in `connection-manager/server/keys`

## Starting the Prototype
1. Set Environmental Variables for AWS_ID and AWS_SECRET
  Unix
  ```sh
      export AWS_ID=<AWS_ID>
      export AWS_SECRE=<AWS_SECRET>
  ```

  Windows
  ```sh
      set AWS_ID=<AWS_ID>
      set AWS_SECRE=<AWS_SECRET>      
  ```
2. Go to `data-retriever` and run `npm start`
3. In another terminal, go to `data-visualiser` and run `npm start`
4. In another terminal, go to `connection-manager` and run `npm start`
5. (Optional) In another terminal, go to `blog` and run `npm start`
