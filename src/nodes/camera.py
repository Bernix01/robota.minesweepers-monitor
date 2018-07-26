#!/usr/bin/env python
import rospy
import cv2
import time
import json
import numpy as np
from sensor_msgs.msg import CompressedImage
from std_msgs.msg import String


class Camera():

    def cb(self,data):
        data = data.data
        camera_img = np.zeros((480,640,3), np.uint8)
        mine_location_data = json.loads(data)
        mine_location_data = [mine_location_data[i:i + 4] for i in xrange(0, len(mine_location_data), 4)]
        for mine in mine_location_data:
            x, y, w, h = mine
            cv2.rectangle(camera_img, (x, y), (x+w, y+h), (0, 0, 255), 2)
        #### Create CompressedIamge ####
        msg = CompressedImage()
        msg.header.stamp = rospy.Time.now()
        msg.format = "jpeg"
        encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]
        result, jpg_img = cv2.imencode('.jpg', camera_img, encode_param)
        if result == False:
            rospy.logerr("Failed to encode jpg")
        msg.data = np.array(jpg_img).tostring()
        # Publish new image
        self.image_pub.publish(msg)

    def __init__(self):
        self.image_pub = rospy.Publisher('/camera_feed/compressed', CompressedImage)
        rospy.init_node('camera')
        rospy.Subscriber('mine_camera_data', String, self.cb)
        


if __name__ == '__main__':
    try:
        node = Camera()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
    cv2.destroyAllWindows()