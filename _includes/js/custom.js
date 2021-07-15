var libraires =[
    "SimpleFOC.h",
    "PciManager.h",
    "PciListenerImp.h",
    "Encoder.h",
    "FOCutils.h",
    "BLDCMotor.h",
    "StepperMotor.h",
    "HallSensor.h",
    "MagneticSensor.h",
    "MagneticSensorSPI.h",
    "MagneticSensorI2C.h",
    "MagneticSensorPWM.h",
    "MagneticSensorAnalog.h",
    "MySensor.h",
    "Sensor.h"
]

var defines =[
    "DEF_POWER_SUPPLY",
    "DEF_PID_VEL_P",
    "DEF_PID_VEL_I",
    "DEF_PID_VEL_D",
    "DEF_P_ANGLE_P",
    "DEF_PID_VEL_U_RAMP",
    "DEF_P_ANGLE_VEL_LIM",
    "DEF_INDEX_SEARCH_TARGET_VELOCITY",
    "DEF_VOLTAGE_SENSOR_ALIGN",
    "DEF_VEL_FILTER_Tf",
    "INH_A",
    "INH_B",
    "INH_C",
    "INL_A",
    "INL_B",
    "INL_C",
    "EN_GATE ",
    "M_PWM",
    "M_OC",
    "OC_ADJ",
    "SPI_MODE0",
    "_MON_TARGET",
    "_MON_VOLT_Q",
    "_MON_VOLT_D",
    "_MON_CURR_Q",
    "_MON_CURR_D",
    "_MON_VEL",
    "_MON_ANGLE",
    "_ACTIVE",
    "_HIGH_IMPEDANCE",
    "_HIGH_Z",
    "_PI",
    "_2PI",
    "HIGH",
    "LOW",
    "DEF_VEL_LIM"
]

var classNames = [
    "BLDCMotor",
    "StepperMotor",
    "BLDCDriver3PWM",
    "BLDCDriver6PWM",
    "StepperDriver4PWM",
    "StepperDriver2PWM",
    "Encoder",
    "MagneticSensor",
    "MagneticSensorSPI",
    "MagneticSensorI2C",
    "MagneticSensorAnalog",
    "MagneticSensorPWM",
    "HallSensor",
    "PciListenerImp",
    "PciManager",
    "Serial",
    "MySensor",
    "Wire",
    "SPIClass",
    "LowPassFilter",
    "PIDController",
    "InlineCurrentSense",
    "CurrentSense",
    "StepDirListener",
    "Commander"
];

var classProps = [
    "PID_velocity",
    "P_angle",
    "LPF_velocity",
    "P",
    "I",
    "Tf",
    "D",
    "output_ramp",
    "quadrature",
    "pullup",
    "voltage_limit",
    "voltage_power_supply",
    "index_search_velocity",
    "controller",
    "velocity_limit",
    "skip_align"
];

var funcNames = [
    "init",
    "initFOC",
    "enableInterrupts",
    "handleA",
    "handleB",
    "handleIndex",
    "handleC",
    "registerListener",
    "linkSensor",
    "linkDriver",
    "useMonitoring",
    "monitor",
    "print",
    "monitor_port",
    "println",
    "getVelocity",
    "getAngle",
    "loopFOC",
    "move",
    "constrainAngle",
    "controllerLQR",
    "sign",
    "shaftVelocity",
    "needsSearch",
    "command",
    "setPhaseVoltage",
    "_delay",
    "_micros",
    "shaftAngle",
    "absoluteZeroAlign",
    "electricAngle",
    "alignSensor",
    "normalizeAngle",
    "_sin",
    "_cos",
    "setPwm",
    "positionP",
    "velocityPID",
    "controllerPID",
    "serialReceiveUserCommand",
    "disable",
    "pinMode",
    "digitalWrite",
    "constrain",
    "linkCurrentSense",
    "getCurrent",
    "getPhaseCurrents",
    "getFOCCurrents",
    "driverAlign",
    "setPhaseState",
    "handle",
    "enableInterrupt",
    "getValue",
    "attach",
    "run",
    "add",
    "pid",
    "lpf",
    "scalar"

];
var structNames = [
    "Pullup",
    "Quadrature",
    "ControlType",
    "FOCModulationType",
    "MagneticSensorSPIConfig_s",
    "MagneticSensorI2CConfig_s",
    "PhaseCurrent_s",
    "DQCurrent_s",
    "TorqueControlType",
    "MotionControlType",
    "Direction",
    "DQVoltage_s",
    "VerboseMode"
];
var structProps = [
    "EXTERN",
    "INTERN",
    "ENABLE",
    "DISABLE",
    "angle",
    "velocity",
    "angle_openloop",
    "velocity_openloop",
    "voltage",
    "SpaceVectorPWM",
    "SinePWM",
    "Trapesoid_120",
    "Trapesoid_150",
    "dc_current",
    "foc_current",
    "torque",
    "CW",
    "CCW",
    "nothing",
    "on_request",
    "user_friendly"
];
jtd.onReady(function(){
    document.querySelectorAll('.n').forEach(function(e) {
        if(classNames.indexOf(e.innerHTML) >= 0 ){
            e.classList.remove("n");
            e.classList.add("className");
        } else if(funcNames.indexOf(e.innerHTML) >= 0 ){
            e.classList.remove("n");
            e.classList.add("fcnName");
        } else if(structNames.indexOf(e.innerHTML) >= 0 ){
            e.classList.remove("n");
            e.classList.add("structName");
        } else if(structProps.indexOf(e.innerHTML) >= 0 ){
            e.classList.remove("n");
            e.classList.add("structProp");
        } else if(classProps.indexOf(e.innerHTML) >= 0 ){
            e.classList.remove("n");
            e.classList.add("classProps");
        }else if(defines.indexOf(e.innerHTML) >= 0 ){
            e.classList.remove("n");
            e.classList.add("defines");
        }
    });

    //include style
    document.querySelectorAll('.cp').forEach(function(e) {
        var str = e.innerHTML;

        // show libraries
        libraires.forEach(function(lib){
            str = str.replace( lib ,"<span class='incLib'>" +lib + "</span>" );
        }); 

        // show defines
        defines.forEach(function(def){
            str = str.replace( def ,"<span class='defines'>" +def + "</span>" );
        }); 
        
        
        // enable comments & defines
        a = str.split('\n');
        a.forEach((element,index) => {
            element = element.replace( /(\/\/)/ ,"<span class='c1'> //" ) + "</span>";
            a[index] = element.replace( "#define" ,"<span class='k'>#define </span> " );
        });

        str = a.join('\n');

        e.innerHTML = str;
    });
});