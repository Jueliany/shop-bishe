const Router = require('koa-router')
const {PositveInterValidator} = require('../../validator/validator')
const {Evaluate} = require('../../models/evaluate')
const common = require('../../common/common')
const router = new Router({
    prefix:'/mini/evaluate'
});
const {
    Auth
} = require('../../../middlewares/auth')
//订单列表
router.post('/list',  async (ctx,next)=>{
    const body = ctx.request.body;
    const evaluate = await Evaluate.getEvaluateList(body.goods_id)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: evaluate
    }
})

//付款

router.post('/creat', new Auth(8).m, async (ctx,next)=>{
    const body = ctx.request.body;
    body.user_id = ctx.auth.uid;
    const evaluate = await Evaluate.creatEvaluate(body)
    ctx.body = {
        resultCode:0,
        resultMsg: 'OK',
        data: evaluate
    }
})


module.exports = router