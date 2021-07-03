const express = require('express')
const router = express.Router()

const { rpc } = require('../../common')

router.get('/:address', async (req, res) => {
  const { logger, cache, db } = req.app.locals
  try {
    const { address } = req.params

    if (!address) {
      return res.status(401).send({ error: 'missing address' })
    }

    const re = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/gi
    if (!re.test(address)) {
      return res.status(401).send({ error: 'invalid address' })
    }

    const cacheKey = `/account/${address}`
    const cachedAccount = cache.get(cacheKey)
    if (cachedAccount) {
      return res.status(200).send(cachedAccount)
    }

    const accountInfo = await rpc.accountInfo({ account: address })
    const data = {
      account: address,
      account_meta: {
        account: address,
        balance: accountInfo.balance,
        block_count: accountInfo.block_count,
        weight: accountInfo.weight,
        confirmation_height: accountInfo.confirmation_height
      }
    }

    const representatives = await db('accounts').where({
      account: address,
      representative: true
    })

    if (!representatives.length) {
      const account = {
        representative: false,
        representative_meta: {},
        uptime: [],
        telemetry: {},
        telemetry_history: [],
        network: {},
        ...data
      }
      cache.set(cacheKey, account, 30)
      return res.status(200).send(account)
    }

    const lastOnline = await db('representatives_uptime')
      .where({
        account: address,
        online: 1
      })
      .orderBy('timestamp', 'desc')
      .limit(1)

    const lastOffline = await db('representatives_uptime')
      .where({
        account: address,
        online: 0
      })
      .orderBy('timestamp', 'desc')
      .limit(1)

    const uptime = await db('representatives_uptime_rollup_2hour')
      .where({ account: address })
      .orderBy('interval', 'asc')

    const repMeta = await db('representatives_meta')
      .where({ account: address })
      .orderBy('timestamp', 'desc')
      .limit(1)

    const network = await db('representatives_network')
      .where({ account: address })
      .orderBy('timestamp', 'desc')
      .limit(1)

    const telemetry = await db('representatives_telemetry')
      .where({ account: address })
      .orderBy('timestamp', 'desc')
      .limit(1000)

    const rep = {
      ...representatives[0],
      ...data
    }
    rep.representative_meta = repMeta[0] || {}
    rep.uptime = uptime
    rep.telemetry = telemetry[0] || {}
    rep.telemetry_history = telemetry
    rep.network = network[0] || {}
    rep.last_online = lastOnline[0] ? lastOnline[0].timestamp : null
    rep.last_offline = lastOffline[0] ? lastOffline[0].timestamp : null

    cache.set(cacheKey, rep, 30)
    res.send(rep)
  } catch (error) {
    logger(error)
    res.status(500).send({ error: error.toString() })
  }
})

module.exports = router
