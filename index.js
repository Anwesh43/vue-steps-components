const defaultPeriod = 20
const delay = 5
class Loop  {
    constructor() {
        this.anims = []
    }

    add(cb) {
        const animObject = new AnimObject(cb)
        this.anims.push(animObject)
        console.log(this.anims)
        if (this.anims.length == 1) {
            this.start()
        }
        return animObject.tag
    }

    start() {
        this.interval = setInterval(() => {
            this.anims.forEach((anim) => {
                anim.execute()
            }, delay)
        })
    }

    stop(tag) {
        for (var i = this.anims.length - 1; i >= 0; i--) {
            const anim = this.anims[i]
            if (anim.tag == tag) {
                this.anims.splice(i, 1)
            }
        }
        if (this.anims.length == 0) {
            clearInterval(this.interval)
        }
    }

}

class AnimObject {
    constructor(cb) {
        this.curr = new Date().getTime()
        this.tag = this.curr
        this.cb = cb
    }

    execute() {
       const currTime = new Date().getTime()
       if (currTime - this.curr >= defaultPeriod) {
            this.curr = currTime
            console.log("coming here")
            this.cb()
       }
    }
}

class State {

    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.05 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

const loop = new Loop()

Vue.component('divbl', {
    props : ["i"],
    data() {
        return {rot : 0, state : new State()}
    },
    methods: {
        rotate() {
            this.rot = 90 * this.state.scale
        },
        startRot() {
            this.state.startUpdating(() => {
                console.log("starting")
                var animId = loop.add(() => {
                    this.rotate()
                    this.state.update(() => {
                        loop.stop(animId)
                        this.rotate()
                    })
                })
            })
        }
    },
    template : '#blockdiv'
})

const vueInstance = new Vue({
    el : '#app',
    data : {
        ar : [0, 1, 2, 3, 4]
    }
})
