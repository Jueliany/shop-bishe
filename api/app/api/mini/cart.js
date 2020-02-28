const Router = require('koa-router')
const {PositveInterValidator} = require('../../validator/validator')
const {Cart} = require('../../models/cart')
const common = require('../../common/common')
const router = new Router({
    prefix:'/mini/cart'
});
const {
    Auth
} = require('../../../middlewares/auth')

router.post('/list', new Auth(8).m, async (ctx,next)=>{
    const body = ctx.request.body;
    console.log(body)
    const good = await Cart.getCartList(ctx.auth.uid)
    let goodsList = good.filter((item)=>{
        return item.goods 
    })
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: goodsList
    }
})
router.post('/add', new Auth(8).m, async (ctx,next)=>{
    const body = ctx.request.body;
    console.log(body)
    const result = await Cart.addCart(body.gid, body.number,ctx.auth.uid)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: result
    }
})

router.get('/count', new Auth(8).m, async (ctx,next)=>{
    const result = await Cart.getCount(ctx.auth.uid)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: result
    }
})

router.post('/update', new Auth(8).m, async (ctx,next)=>{
    const body = ctx.request.body;
    const result = await Cart.updateCart(body.id,body.num)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: result
    }
})

router.post('/delete', new Auth(8).m, async (ctx,next)=>{
    const body = ctx.request.body;
    const result = await Cart.deleteCart(body.ids,ctx.auth.uid)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: result
    }
})



module.exports = router