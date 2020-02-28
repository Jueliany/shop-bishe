const Router = require('koa-router')
const {
    TokenValidator,
    NotEmptyValidator
} = require('../../validator/validator')
const {
    LoginType
} = require('../../lib/enum')
const {
    User
} = require('../../models/user')
const { WXManager } = require('../../services/wx')
const { generateToken } = require('../../../core/util')
const {Auth} = require('../../../middlewares/auth')


const router = new Router({
    prefix:'/v1/token'
});
router.post('/',async (ctx)=>{
        const v = await new TokenValidator().validate(ctx)
        let token;
        switch (v.get('body.type')) {
            case LoginType.USER_EMAIL:
                token = await emailLogin(v.get('body.account'),v.get('body.secret') )
                break;
            case LoginType.USER_MINI_PROGRAM:
                token = await WXManager.codeToToken(v.get('body.account'))
                break;
            case LoginType.ADMIN_USER:
                token = await usernameLogin(v.get('body.account'),v.get('body.secret') )
                break;
            default:
                break;
        }
        ctx.body = {
            resultCode:0,
            token
        }
})

router.post('/verify', async (ctx)=>{
    // token
    const v =await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid:result
    }
})


async function emailLogin(account, secret) {
    const user = await
        User.verifyRmailPassword(account, secret)
    return token = generateToken(user.id, Auth.USER)
}

async function usernameLogin(account, secret) {
    const user = await
        User.verifyUserPassword(account, secret)
    return token = generateToken(user.id, Auth.USER)
}



module.exports = router