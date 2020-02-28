const {Sequelize,Model,Op} = require('sequelize')
const {db} = require('../../core/db')
const {Goods} = require('./goods')
const {User} = require('./user')
const {Evaluate} = require('./evaluate')
const {Category} = require('./category')
class Order extends Model {
    static async getOrderList(start = 1, limit = 10,user_id,goods_id,order_number,order_state, category_id,aftersale_state){
        
        const orders = await Order.findAndCountAll({
            where: {
                user_id: {
                    [Op.like]:'%' + user_id + '%'
                },
                order_number: {
                    [Op.like]:'%' + order_number + '%'
                },
                goods_id: {
                    [Op.like]:'%' + goods_id + '%'
                },
                category_id: category_id > 0  ? category_id : {[Op.not]:1,},
                order_state: order_state >= 0  ? order_state : {[Op.not]:-1,},
                aftersale_state: aftersale_state >= 0  ? aftersale_state : {[Op.not]:-1,},
            },
            offset: (start - 1) * limit,
            limit,
            include:[{
                model:Goods,
                as: 'goods'
            },
            {
                model:Category,
                as: 'category'
            }]
        })
        if(!orders){
            throw new global.errs.NotFound('查询失败')
        }

        console.log()
        return orders
    }

    //小程序订单列表
    static async getMiniOrderList(order_state,user_id){
        const orders = await Order.findAll({
            where: {
                user_id,
                order_state: order_state >= 0  ? order_state : {[Op.not]:-1,},
            },
            order:[['created_at', 'DESC']],
            include:[{
                model:Goods,
                as: 'goods'
            }]
        })
        if(!orders){
            throw new global.errs.NotFound('查询失败')
        }

        return orders
    }

    //订单详情
    static async findOrder(id){
        const order = await Order.findOne({
            where:{
                id
            },
            include:[{
                model:Goods,
                as: 'goods'
            }]
        })
        if(!order){
            throw new global.errs.NotFound('查询失败')
        }
        return order
    }

    //获取订单信息支付
    static async getBookingInfo(order_number){
        const order = await Order.findAll({
            where:{
                order_number
            },
            include:[{
                model:Goods,
                as: 'goods'
            }]
            
        })
        if(!order){
            throw new global.errs.NotFound('查询失败')
        }
        return order
    }


    //创建订单
    static async creatOrder(data){       
        const goods1 = await Goods.findGood(data.goods_id)
        if(goods1.stock_number >= data.goods_number){
            let stock_number = goods1.stock_number - data.goods_number;
            let sold_number = goods1.sold_number + data.goods_number
            const goods2 = await Goods.updateGood(data.goods_id,{stock_number, sold_number})
            const order = await Order.create(data)
            if(!order){
                throw new global.errs.AuthFailed('创建订单失败')
            } 
        }else{
            throw new global.errs.AuthFailed('商品数量不足')
        }
        
        
        return goods1
    }
    //付款
    static async payOrder(order_number,data){
        const order = await Order.update(data,{
            where:{
                order_number
            }
        })
        if(order[0] == 0){
            throw new global.errs.AuthFailed('失败')
        }
        return order
    }
    //取消 
    static async cancelOrder(order_number){
        const order = await Order.update({order_state:4},{
            where:{
                order_number
            }
        })
        if(order[0] == 0){
            throw new global.errs.AuthFailed('失败')
        }
        return order
    }
    //修改
    static async updateOrder(id,data){
        const order = await Order.update(data,{
            where:{
                id
            }
        })
        if(order[0] == 0){
            throw new global.errs.AuthFailed('失败')
        }
        return order
    }

    //确认收货
    static async confirmOrder(order_number,data){
        const order = await Order.update(data,{
            where:{
                order_number
            }
        })
        if(order[0] == 0){
            throw new global.errs.AuthFailed('失败')
        }
        return order
    }

    //修改状态
    static async updateMiniOrder(order_number,data){
        const order = await Order.update(data,{
            where:{
                order_number
            }
        })
        if(order[0] == 0){
            throw new global.errs.AuthFailed('失败')
        }
        return order
    }
}
Order.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_number: Sequelize.STRING,
    user_id: Sequelize.INTEGER,
    address:Sequelize.STRING,
    manname:Sequelize.STRING,
    phone:Sequelize.STRING,
    goods_id: Sequelize.INTEGER,   
    goods_number: Sequelize.INTEGER,   
    category_id: Sequelize.INTEGER, 
    order_state: Sequelize.INTEGER,
    order_price: Sequelize.DECIMAL,
    evaluate_id: Sequelize.INTEGER,
    evaluate_datetime: Sequelize.DATE,
    express_price: Sequelize.DECIMAL,
    order_remark: Sequelize.STRING,
    aftersale_state: Sequelize.INTEGER,
    express_number: Sequelize.STRING,
    aftersale_remark: Sequelize.STRING,
    aftersale_price: Sequelize.DECIMAL,
    aftersale_bcs: Sequelize.STRING,
    aftersale_express: Sequelize.STRING,
    pay_datetime: Sequelize.DATE,
    get_datetime: Sequelize.DATE,
    send_datetime: Sequelize.DATE,
},{
    sequelize:db,
    tableName: 'order'
})
Order.belongsTo(User, {as:'user',foreignKey: 'user_id', targetKey: 'id'});
Order.belongsTo(Goods, {as:'goods',foreignKey: 'goods_id', targetKey: 'id'});
Order.belongsTo(Category, {as:'category',foreignKey: 'category_id', targetKey: 'id'});
module.exports = {
    Order    
}