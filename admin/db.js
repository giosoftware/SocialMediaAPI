var users = db.users.find({}, {__v:0});
while (users.hasNext()) {
    wall = {};
    user = users.next();
    wall.uid = user._id;
    wall.n = user.prof.n;
    wall.i = user.i;
    wall.m = '' + new Date().getUTCFullYear() + (new Date().getUTCMonth()+1);
    wall.p = [];

    var posts = db.posts.aggregate([
        { $project: {__v: 0} },
        {
            $match: {
                $or: [
                    { uid: user._id },
                    {
                        $and: [{ i: { $in: user.i } }, { uid: { $nin: user.b } }]
                    }
                ]
            }
        },
        { $sort: { d: -1 } }
    ]);

    while (posts.hasNext()) {
        post = posts.next();
        comms = db.comments.find({pid: post._id, uid: { $nin: user.b }}, {__v:0}).limit(3).sort({d: -1})
        post.comm = comms.toArray();
        wall.p.push(post);
        //printjson(post);
    }
    print(wall);
}
