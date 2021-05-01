
/**
 * 设置  session缓存
 */
function setSession(key, obj) {
    if (typeof obj === 'string') {
        sessionStorage.setItem(key, obj);
    } else {
        sessionStorage.setItem(key, JSON.stringify(obj));
    }
}

/**
 * 获取
 */
function getSession(key) {
    let val = sessionStorage.getItem(key);
    try {
        return JSON.parse(val);
    } catch (e) {
        return val;
    }
}

/**
 * 删除， 如果不传值，删除所有
 */
function clearSession(key) {
    if (key) {
        sessionStorage.removeItem(key);
    } else {
        sessionStorage.clear();
    }
}
export {
    setSession,
    getSession,
    clearSession
}