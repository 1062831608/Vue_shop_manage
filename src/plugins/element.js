import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Icon, Message, Container, Main,
  Aside, Header, MenuItemGroup, MenuItem, Submenu, Menu, Breadcrumb,
  BreadcrumbItem, Card, Table, TableColumn, Switch, Row, Col,
  Tooltip, Pagination, Dialog, MessageBox,Tag, Tree,Select, Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
//Message挂载
Vue.prototype.$message = Message
//MessageBox 挂载
Vue.prototype.$confirm = MessageBox
