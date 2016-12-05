package com.yingu.usermanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * <B>文件名称：</B><BR>
 * <B>文件描述：</B><BR>
 * <BR>
 * <B>版权声明：</B>(C)2016-2018<BR>
 * <B>公司部门：</B>东方银谷 研发二部 CBG<BR>
 * <B>创建时间：</B>16/12/2<BR>
 *
 * @author 李云龙  liyunlong@yingu.com
 * @version 1.0
 **/

@Controller
public class LoginController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String welcome(Model model) {
        model.addAttribute("host", "http://blog.didispace.com");
        return "index";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String loginForm(Model model) {
        return "login";
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public String user(Model model) {
        model.addAttribute("host", "http://www.baidu.com");
        return "user";

    }
}
