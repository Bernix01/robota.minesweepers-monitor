#!/usr/bin/env python
import rospy
from minesweepers_monitor.msg import Gyro

def callback(data):
    rospy.loginfo("I heard %s",data.data)
    
def monitor_gyro():
    rospy.init_node('monitor_gyro')
    rospy.Subscriber("gyro_data", Gyro, callback)
    # spin() simply keeps python from exiting until this node is stopped
    rospy.spin()



if __name__ == '__main__':
    try:
        monitor_gyro()
    except rospy.ROSInterruptException:
        pass