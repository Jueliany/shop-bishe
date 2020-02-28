const Koa = require('koa');
const parser = require('koa-bodyparser');
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
//handle request entity too large
require('./app/models/evaluate')
const app = new Koa();
app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200; 
    } else {
      await next();
    }
  });
app.use(catchError)
app.use(parser({
  formLimit:"5mb",
  jsonLimit:"5mb",
  textLimit:"5mb",
  enableTypes: ['json', 'form', 'text']
})) 
InitManager.initCore(app);
app.listen(3000)
console.log('app is starting !')