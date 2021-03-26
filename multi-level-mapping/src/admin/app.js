exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message:'You have reached the admin portal'}),
  };
};