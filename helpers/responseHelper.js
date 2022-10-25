exports.ok = (res, data, code = 200) => {
    const response =
        data.length > 1
            ? {
                  success: true,
                  length: data.length,
                  data,
              }
            : {
                  success: true,
                  data,
              }
    return res.status(code).json(response)
}

exports.bad_request = (res, message, code = 400) => {
    return res.status(code).json({
        success: false,
        message,
    })
}

exports.server_error = (res, error, code = 500) => {
    console.log('error=>', error)
    return res.status(code).json({
        success: false,
        error,
    })
}
