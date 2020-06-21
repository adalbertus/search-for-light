let lightLevel = 0;
let lightLevelDownTreshold = 50
let lightLevelUpTreshold1 = 100
let lightLevelUpTreshold2 = 180
let isFullSpeed = false
let roboMode = "STOP"

serial.redirectToUSB()
basic.showIcon(IconNames.SmallHeart)
basic.showIcon(IconNames.Heart)
basic.showIcon(IconNames.SmallHeart)
basic.showIcon(IconNames.Heart)
basic.clearScreen()

function driveBackward (ms: number = 0) {
    pins.servoWritePin(AnalogPin.P1, 180)
    pins.servoWritePin(AnalogPin.P2, 0)
    if (ms > 0) {
        basic.pause(ms)
        driveStop()
    }
}

// go forward slowly - to remove "jumping"
function driveForward (ms: number = 0) {
    if(!isFullSpeed) {
        pins.servoWritePin(AnalogPin.P1, 85)
        pins.servoWritePin(AnalogPin.P2, 95)
        basic.pause(50)

        pins.servoWritePin(AnalogPin.P1, 80)
        pins.servoWritePin(AnalogPin.P2, 100)
        basic.pause(50)

        pins.servoWritePin(AnalogPin.P1, 70)
        pins.servoWritePin(AnalogPin.P2, 120)
        basic.pause(30)

        pins.servoWritePin(AnalogPin.P1, 0)
        pins.servoWritePin(AnalogPin.P2, 180)
    }
    isFullSpeed = true
    if (ms > 0) {
        basic.pause(ms)
        driveStop()
    }
}

function driveStop () {
    pins.servoWritePin(AnalogPin.P1, 90)
    pins.servoWritePin(AnalogPin.P2, 90)
    isFullSpeed = false
}

function turn(direction : Direction, ms : number = 100) {
    isFullSpeed = false
    if(direction == Direction.Right) {
        pins.servoWritePin(AnalogPin.P1, 90)
        pins.servoWritePin(AnalogPin.P2, 95)       
        basic.pause(50)

        pins.servoWritePin(AnalogPin.P1, 90)
        pins.servoWritePin(AnalogPin.P2, 100)
        basic.pause(50)

        pins.servoWritePin(AnalogPin.P1, 90)
        pins.servoWritePin(AnalogPin.P2, 120)
        basic.pause(30)
        
        pins.servoWritePin(AnalogPin.P1, 90)
        pins.servoWritePin(AnalogPin.P2, 180)
    } else {
        pins.servoWritePin(AnalogPin.P1, 85)
        pins.servoWritePin(AnalogPin.P2, 90)              
        basic.pause(30)

        pins.servoWritePin(AnalogPin.P1, 60)
        pins.servoWritePin(AnalogPin.P2, 90)
        basic.pause(50)
        
        pins.servoWritePin(AnalogPin.P1, 0)
        pins.servoWritePin(AnalogPin.P2, 90)
        basic.pause(50)
    }
    basic.pause(ms)
    driveStop()
}

function searchForLight() {
    lightLevel = input.lightLevel()
    if(lightLevel >= lightLevelDownTreshold && lightLevel <= lightLevelUpTreshold1) {
        basic.showIcon(IconNames.Confused)
        turn(Direction.Right)
    } else if (lightLevel >  lightLevelUpTreshold1 && lightLevel <= lightLevelUpTreshold2) {
        // go for light
        basic.showIcon(IconNames.Happy)
        driveForward()
    } else {
        basic.showIcon(IconNames.SmallSquare)
        driveStop()
    }
}

input.onButtonPressed(Button.A, function () {
    roboMode = "search for light"
})

input.onButtonPressed(Button.B, function () {
    roboMode = "STOP"
    driveStop()
    basic.showIcon(IconNames.Target)
})

basic.forever(function () {
    // lightLevel = input.lightLevel()
    // serial.writeNumber(lightLevel)
    // serial.writeLine("");

    if(roboMode == "search for light") {
        basic.pause(250)
        searchForLight()
    }
})
