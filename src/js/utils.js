function getCurrentPosition()
{
    return new Promise(function(resolve, reject)
    {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

module.exports = { getCurrentPosition };