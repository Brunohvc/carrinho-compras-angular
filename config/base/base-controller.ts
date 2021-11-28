import { Request, Router } from "express";

function createBaseController(options: {
    handler: { [key: string]: any },
    router: Router,
    madeBasicRoutes?: boolean | undefined
}) {

    function addRoute(type: 'get' | 'post' | 'put' | 'delete' | 'options',
        route: string, functionName: string) {
        if (options.handler[functionName]) {
            options.router[type](route, function (req: Request, res) {
                let data, param1, param2;
                if (type === 'get') {
                    data = { ...req.query, ...req.params };
                } else {
                    data = req.body;
                }

                if (type === 'get' && Object.keys(data).length == 1 && data.id) {
                    try {
                        param1 = parseInt(data.id);
                    } catch (err) {
                        return res.status(503).send('Server Error!');
                    };
                }

                if (type === 'post' && functionName == 'insert' && Object.keys(data).length > 0) {
                    param1 = data;
                }

                if (type === 'put' && functionName == 'update' && Object.keys(data).length > 0) {
                    param1 = data.id;
                    param2 = data;
                    delete param2.id;
                }

                if (type === 'delete' && functionName == 'delete' && Object.keys(data).length == 1 && data.id) {
                    try {
                        param1 = parseInt(data.id);
                    } catch (err) {
                        return res.status(503).send('Server Error!');
                    };
                }

                console.log('req.body:', req.body);
                console.log('req.params:', req.params);
                console.log('req.query:', req.query);

                console.log('data:', data);

                options.handler[functionName](param1, param2).then((result: any) => {
                    res.send(result);
                }).catch((err: any) => {
                    res.status(400).send(err);
                })
            });
        }
    }

    if (options.madeBasicRoutes) {
        addRoute('get', '/', 'get');
        addRoute('get', '/get-by-id/:id', 'get');
        addRoute('post', '/', 'insert');
        addRoute('put', '/', 'update');
        addRoute('delete', '/:id', 'delete');
    }

    return {
        addRoute
    };
}

export default createBaseController;