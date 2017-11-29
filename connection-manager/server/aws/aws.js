const awsCli = require('aws-cli-js');
const Options = awsCli.Options;
const Aws = awsCli.Aws;

const options = new Options(
    process.env.AWS_ID,
    process.env.AWS_SECRET,
    null
);

const aws = new Aws(options);

module.exports = {
    getInstances: function (instanceType) {
        const keys = [
            'PublicDnsName',
            'InstanceId',
            'AvailabilityZone',
            'State'
        ];
        // "Name=tag:' + instanceType + ',Values=1"
        return aws.command('ec2 describe-instances --filters "Name=tag:serverID,Values=2"')
            .then(function (data) {
                const json = JSON.parse(data.raw);
                const instancesJSON = json.Reservations[0].Instances;

                let instances = [];
                for (let instanceNo in instancesJSON) {
                    const instanceJSON = instancesJSON[instanceNo];
                    let instance = {};

                    for (const key in instanceJSON) {
                        const value = instanceJSON[key];
                        if (keys.indexOf(key) !== -1) {
                            instance[key] = value;
                        }
                    }

                    instances.push(instance);
                }

                return instances;
            })
            .catch(function(err) {
                return err;
            });
    },
    startInstance: function (instanceID) {
        return aws.command('ec2 start-instances --instance-ids ' + instanceID)
            .then(function (data) {
                return data.raw;
            })
            .catch(function(err) {
                return err;
            });
    },
    stopInstance: function (instanceID) {
        return aws.command('ec2 stop-instances --instance-ids ' + instanceID)
            .then(function (data) {
                return data.raw;
            })
            .catch(function(err) {
                return err;
            });
    },
    getPublicDNS: function () {
        return this.getInstances('singleNode')
            .then(function(instances) {
                if (instances !== undefined && instances[0].State.Name === 'stopped') {
                    this.startInstance(instances[0].InstanceId);
                }
                else if (instances !== undefined) {
                    return instances[0].PublicDnsName;
                }
            })
            .catch(function(err) {
                return err;
            });
    }
};
