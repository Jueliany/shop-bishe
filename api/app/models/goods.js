const {Sequelize,Model,Op} = require('sequelize')
const {db} = require('../../core/db')
const {Category} = require('./category')
class Goods extends Model {
    //后台列表查询
    static async getGoodList(limit = 10,start = 1,categoryId = -1,state = -1,keyWord = ""){
        const good = await Goods.findAndCountAll({
            where: {
                id : {
                    [Op.not]:1,
                },
                name: {
                    [Op.like]:'%' + keyWord + '%'
                },
                category_id: categoryId > 0  ? categoryId : {[Op.not]:1,},
                state: state != -1 ? state : {[Op.not]:2}
            },
            offset: (start - 1) * limit,
            limit,
            include:[{
                model:Category,
                as: 'category'
            }]
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }

    //小程序或许商品列表
    
    static async getMiniGoodList(order, categoryId = -1,keyWord = ""){
        let oop = order == 'default' ? ['sold_number'] : order == 'asc' ?  ['price','asc'] : ['price','desc'] 
        const good = await Goods.findAll({
            where: {
                name: {
                    [Op.like]:'%' + keyWord + '%'
                },
                category_id: categoryId > 0  ? categoryId : {[Op.not]:0,},
                state: 1
            },
            order:[oop]
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }
    //获取商品下拉
    static async getGoodSelectList(){
        const good = await Goods.findAll({
            where: {
                id : {
                    [Op.not]:1,
                },
                state: 1
            },
            attributes:['id','name']
        
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }

    //获取商品详情
    static async findGood(id,type){
        const good = await Goods.findOne({
            where:{
                id
            },
            attributes:['id','name','category_id','price','old_price','look_number','sold_number','stock_number','state','brief','detail','url',]
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        if(type){
            //  good.increment('look_number')
            good.increment('look_number').then(function(user){
                console.log('success');
              })
            
        }
        return good
    }
    //新增
    static async addGood(data){
        const good = await Goods.create(data)
        if(!good){
            throw new global.errs.AuthFailed('新增失败')
        }
        return good
    }
    //修改
    static async updateGood(id,data){
        const good = await Goods.update(data,{
            where:{
                id
            }
        })
        if(good[0] == 0){
            throw new global.errs.AuthFailed('修改失败')
        }
        return good
    }
    //删除
    static async deleteGood(id){
        const good = await Goods.destroy({
            where:{
                id
            }
        })
        if(!good){
            throw new global.errs.AuthFailed('删除失败')
        }
        return good
    }
    
    //获取热门商品
    static async getHotGoods(){
        const good = await Goods.findAll({
            where:{
                state:1
            },
            limit:8,
            order:[['sold_number', 'DESC']]
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }
    //获取精选商品
    static async getChoicenessGoods(){
        const good = await Goods.findAll({
            where:{
                choiceness:1,
                state:1
            },
            limit:5,
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }
    //获取最新报价商品
    static async getNewPriceGoods(){
        const good = await Goods.findAll({
            order: [
                ['updated_at'],
            ],
            limit:5,
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }
    //获取下单商品
    static async getBookingGoodList(ids){
        const good = await Goods.findAll({
            where: {
                id : {
                    [Op.in]:ids,
                },
                state: 1
            },
            attributes:['id','name','price','category_id','stock_number','url']
        
        })
        if(!good){
            throw new global.errs.NotFound('查询失败')
        }
        return good
    }
}
Goods.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    category_id: Sequelize.INTEGER,
    stock_number: Sequelize.INTEGER,
    look_number: Sequelize.INTEGER,
    state: Sequelize.INTEGER,
    choiceness: Sequelize.INTEGER,
    sold_number: Sequelize.INTEGER,
    brief: Sequelize.STRING,
    detail: Sequelize.STRING,
    old_price: Sequelize.DECIMAL,
    price: Sequelize.DECIMAL,
    url: Sequelize.STRING,
},{
    sequelize:db,
    tableName: 'goods'
})
Goods.belongsTo(Category, {as:'category',foreignKey: 'category_id', targetKey: 'id'});
module.exports = {
    Goods    
}