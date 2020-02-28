const Router = require('koa-router')
const {PositveInterValidator} = require('../../validator/validator')
const {Goods} = require('../../models/goods')
const common = require('../../common/common')
const router = new Router({
    prefix:'/mini/goods'
});
const {
    Auth
} = require('../../../middlewares/auth')

router.post('/list', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.getMiniGoodList(body.order,body.category, body.keyWord)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})
router.get('/count', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.getGoodList(1,100,-1,1)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})

//分类商品
router.post('/catalogGoods', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.getGoodList(20, body.pageNum,  body.category,1,"")
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})
//热门商品
router.get('/hot', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.getHotGoods()

    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})
//精选商品
router.get('/choiceness', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.getChoicenessGoods()

    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})
//最新报价
router.get('/new', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.getNewPriceGoods()

    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})

//商品详情
router.post('/detail', async (ctx,next)=>{
    const body = ctx.request.body;
    const good = await Goods.findGood(body.id, 1)

    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})
//下单信息
router.post('/bookingGoods', async (ctx,next)=>{
    const body = ctx.request.body;
    let ids = [];
    for(var item of body.ids){
        ids.push(item.id)
    }
    const good = await Goods.getBookingGoodList(ids)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: good
    }
})



module.exports = router