module.exports = (req, res, next)=>{
    res.append('Access-Control-Allow-Origin', '*');
    next()
}