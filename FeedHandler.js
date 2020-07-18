const request = require('request');

function getFeedData() {
  const _this = this
  const feed = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';
  return new Promise((resolve, reject) => {
    request({
      uri: feed,
      encoding: 'UTF-8'
    },
    (error, response, body) => {
      _this.generateFeedObject(body)
      .then(articles => {
        if (articles.length) {
          resolve(articles)
        } else {
          reject('No articles retrieved')
        }
      })
    })
  })
}

module.exports = {
  getFeedData
}

