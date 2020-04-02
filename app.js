const Koa = require('koa');
const cors = require('@koa/cors')
const uploadRouter = require('./routes/upload')
const static = require('koa-static')

const app = new Koa()

app.use(cors())

app.use(static('upload'))
app.use(static('dist'))
app.use(async (ctx,next) => {
  ctx.body = 'Not found'
  await next()
})

app.use(uploadRouter.routes())
app.listen(3001)
