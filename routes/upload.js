const Router = require("koa-router");
const multer = require('@koa/multer')
const glob = require('glob')
const router = new Router()
const config = require('../config/config')
const path = require('path')
const upload = multer()
const fs = require('fs')
router.prefix('/api')

// 上传图片的路由
router.post(
  '/upload',
  upload.single('pic'),
  ctx => {
    ctx.body = 'done';
    let time = new Date().getTime()
    fs.writeFile(path.resolve(config.uploadPath, time + ctx.file.originalname), ctx.file.buffer, (err) => {
      console.log(err)
    })
  }
);

// 获取图片列表的路由
router.get('/list', async ctx => {
  let match = `upload/*`
  try {
    let file = await glob.sync(match)
    console.log(file)
    ctx.body = {
      meta: {
        msg: '获取图片成功',
        status: 200
      },
      data: file
    }
  } catch (error) {
    ctx.body = {
      meta: {
        msg: "err",
        status: "500"
      }
    }
  }
})

// 删除图片列表的路由
router.delete('/del', async ctx => {
  const { delImg } = ctx.query
  if (!delImg) {
    return ctx.body = {
      meta: {
        msg: '参数错误',
        status: 400
      }
    }
  }
  let match = 'upload/*'
  try {
    let files = glob.sync(match)
    let file = files.find(v => v === delImg)
    let err = await delFile(file)
    if (!err) {
      ctx.body = {
        meta: {
          status: 204,
          msg: '删除成功'
        }
      }
    }
    if (err) {
      return ctx.body = {
        meta: {
          msg: "删除失败",
          status: 400
        }
      }
    }

  } catch (error) {
    ctx.body = {
      meta: {
        msg: "删除图片不存在",
        status: 404
      }
    }
  }
})

// 删除图片
const delFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) {
        reject(err)
      }
      if (!err) {
        resolve(null)
      }
    })
  })
}
module.exports = router
