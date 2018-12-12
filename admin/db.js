var users = db.users.find({});
while (users.hasNext()) {
    wall = {};
    user = users.next();
    wall.uid = user._id;
    wall.n = user.prof.n;
    wall.i = user.i;
    wall.m = "" + new Date().getUTCFullYear() + new Date().getUTCMonth();
    wall.p = [];

    var posts = db.posts.aggregate([
        {
            $match:
            {
                $or:
                    [
                        { uid: user._id },
                        {
                            $and:
                                [
                                    { i: user.i },
                                    { uid: { $nin: user.b } }
                                ]
                        }
                    ]
            }

        },
        { $sort: { d: -1 } }
    ]);

    while (posts.hasNext()) {
        post = posts.next();
        wall.p.push(post);
        //printjson(post);
    }
    printjson(wall);
}
