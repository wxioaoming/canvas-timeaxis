import {request} from './request'
import axios from "axios";

export function getPatternData () {
  return request({
    url:'/server/screen/home',
    method:'get',
  })
}