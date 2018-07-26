#!/usr/bin/env python
import rospy
import cv2
import time
import json
import numpy as np

from std_msgs.msg import String

def cb(data):
    data = data.data
    camera_img = np.zeros((480,640,3), np.uint8)
    mine_location_data = json.loads(data)
    mine_location_data = [mine_location_data[i:i + 4] for i in xrange(0, len(mine_location_data), 4)]
    for mine in mine_location_data:
        x, y, w, h = mine
        cv2.rectangle(camera_img, (x, y), (x+w, y+h), (0, 0, 255), 2)
    cv2.imshow("camara", camera_img)
    cv2.waitKey(10)

def camera():   
    rospy.init_node('camera')
    rospy.Subscriber('camera_feed', String, cb)
    rate = rospy.Rate(10)  # 10hz
    rospy.spin()
        


if __name__ == '__main__':
    try:
        camera()
    except rospy.ROSInterruptException:
        pass
