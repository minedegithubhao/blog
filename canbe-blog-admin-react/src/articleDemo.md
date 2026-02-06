1. 设计模式概述

## 1.1 什么是设计模式？

设计模式是解决特定问题的经典方案模板，是软件工程师在长期实践中总结出的最佳实践。如同建筑领域的蓝图，设计模式为软件开发提供了可复用的解决方案。

## 1.2 为什么需要设计模式？

- **提高代码复用性**：避免重复造轮子
- **增强系统可维护性**：代码结构清晰，易于理解和修改
- **促进团队协作**：提供统一的设计词汇
- **降低系统复杂度**：通过良好设计分解复杂问题

# 2. 设计模式七大原则

设计原则是设计模式的指导思想，理解这些原则比死记模式更重要。

## 2.1 单一职责原则 (SRP)

一个类应该只有一个引起变化的原因。

```java
// 错误示例：承担过多职责
class UserService {
    public void addUser(User user) { /* 添加用户 */ }
    public void sendEmail(User user) { /* 发送邮件 */ }
    public void generateReport() { /* 生成报表 */ }
}

// 正确示例：职责分离
class UserManager {
    public void addUser(User user) { /* 专注于用户管理 */ }
}

class EmailService {
    public void sendEmail(User user) { /* 专注于邮件发送 */ }
}

class ReportGenerator {
    public void generateReport() { /* 专注于报表生成 */ }
}
```

## 2.2 开闭原则 (OCP)

对扩展开放，对修改关闭。

```java
// 抽象形状
interface Shape {
    double calculateArea();
}

// 具体实现
class Rectangle implements Shape {
    private double width;
    private double height;
    
    public double calculateArea() {
        return width * height;
    }
}

class Circle implements Shape {
    private double radius;
    
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

// 面积计算器 - 对扩展开放
class AreaCalculator {
    public double calculateTotalArea(List<Shape> shapes) {
        return shapes.stream()
                    .mapToDouble(Shape::calculateArea)
                    .sum();
    }
}
```

## 2.3 里氏替换原则 (LSP)

子类必须能够替换它们的基类。

```java
class Bird {
    public void eat() {
        System.out.println("吃东西");
    }
}

class FlyingBird extends Bird {
    public void fly() {
        System.out.println("飞行");
    }
}

class Sparrow extends FlyingBird {
    // 麻雀可以替换FlyingBird，也可以替换Bird
}

class Ostrich extends Bird {
    // 鸵鸟不会飞，但可以替换Bird
}
```

## 2.4 接口隔离原则 (ISP)

客户端不应该被迫依赖它们不使用的接口。

```java
// 错误的庞大接口
interface Worker {
    void work();
    void eat();
    void sleep();
}

// 正确的细分接口
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class Human implements Workable, Eatable, Sleepable {
    public void work() { /* 工作 */ }
    public void eat() { /* 吃饭 */ }
    public void sleep() { /* 睡觉 */ }
}

class Robot implements Workable {
    public void work() { /* 工作 */ }
    // 机器人不需要吃饭睡觉
}
```

## 2.5 依赖倒置原则 (DIP)

依赖抽象而不是具体实现。

```java
// 高层模块
class NotificationService {
    private MessageSender messageSender;
    
    public NotificationService(MessageSender messageSender) {
        this.messageSender = messageSender; // 依赖抽象
    }
    
    public void sendNotification(String message) {
        messageSender.send(message);
    }
}

// 抽象接口
interface MessageSender {
    void send(String message);
}

// 具体实现
class EmailSender implements MessageSender {
    public void send(String message) {
        System.out.println("发送邮件: " + message);
    }
}

class SmsSender implements MessageSender {
    public void send(String message) {
        System.out.println("发送短信: " + message);
    }
}
```

## 2.6 迪米特法则 (LoD)

只与直接的朋友通信。

```java
// 错误示例：了解太多细节
class CustomerService {
    public void processOrder(Order order) {
        Customer customer = order.getCustomer();
        Address address = customer.getAddress();
        String city = address.getCity();
        // 直接操作底层对象
    }
}

// 正确示例：只与直接朋友通信
class CustomerService {
    public void processOrder(Order order) {
        String shippingCity = order.getShippingCity(); // 只调用直接方法
        // 处理订单...
    }
}

class Order {
    public String getShippingCity() {
        return customer.getAddress().getCity(); // 封装细节
    }
}
```

## 2.7 合成复用原则 (CRP)

优先使用组合，而不是继承。

```java
// 继承方式（不推荐）
class Car extends Engine {
    // Car继承了Engine的所有方法
}

// 组合方式（推荐）
class Car {
    private Engine engine;  // 组合关系
    private Wheel[] wheels; // 组合关系
    
    public Car(Engine engine, Wheel[] wheels) {
        this.engine = engine;
        this.wheels = wheels;
    }
    
    public void start() {
        engine.ignite(); // 委托给引擎
    }
}
```
3. 创建型模式 (5种)
创建型模式关注对象的创建机制，增加系统的灵活性和可复用性。

3.1 单例模式 (Singleton)
确保一个类只有一个实例

Syntax error in text
mermaid version 10.9.1
public class Logger {
    private static Logger instance;
    
    private Logger() {
        // 私有构造函数
    }
    
    public static Logger getInstance() {
        if (instance == null) {
            synchronized (Logger.class) {
                if (instance == null) {
                    instance = new Logger();
                }
            }
        }
        return instance;
    }
    
    public void log(String message) {
        System.out.println("LOG: " + message);
    }
}

// 使用
Logger logger = Logger.getInstance();
logger.log("应用启动");
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
3.2 工厂方法模式 (Factory Method)
让子类决定实例化哪个类

interface Payment {
    void pay(double amount);
}

class Alipay implements Payment {
    public void pay(double amount) {
        System.out.println("支付宝支付: " + amount);
    }
}

class WechatPay implements Payment {
    public void pay(double amount) {
        System.out.println("微信支付: " + amount);
    }
}

abstract class PaymentFactory {
    public abstract Payment createPayment();
    
    public void processPayment(double amount) {
        Payment payment = createPayment();
        payment.pay(amount);
    }
}

class AlipayFactory extends PaymentFactory {
    public Payment createPayment() {
        return new Alipay();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
3.3 抽象工厂模式 (Abstract Factory)
创建相关对象的家族

interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton();
    }
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

class MacFactory implements GUIFactory {
    public Button createButton() {
        return new MacButton();
    }
    public Checkbox createCheckbox() {
        return new MacCheckbox();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
3.4 建造者模式 (Builder)
分步骤构建复杂对象

public class Computer {
    private String CPU;
    private String RAM;
    private String storage;
    
    public static class Builder {
        private String CPU;
        private String RAM;
        private String storage;
        
        public Builder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }
        
        public Builder setRAM(String RAM) {
            this.RAM = RAM;
            return this;
        }
        
        public Builder setStorage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
    }
}

// 使用
Computer computer = new Computer.Builder()
    .setCPU("Intel i7")
    .setRAM("16GB")
    .setStorage("1TB SSD")
    .build();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
3.4 建造者模式 (Builder)
分步骤构建复杂对象

```
public class Computer {
    private String CPU;
    private String RAM;
    private String storage;
    
    public static class Builder {
        private String CPU;
        private String RAM;
        private String storage;
        
        public Builder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }
        
        public Builder setRAM(String RAM) {
            this.RAM = RAM;
            return this;
        }
        
        public Builder setStorage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
    }
}

// 使用
Computer computer = new Computer.Builder()
    .setCPU("Intel i7")
    .setRAM("16GB")
    .setStorage("1TB SSD")
    .build();
```

3.5 原型模式 (Prototype)
通过拷贝创建新对象

```
interface Prototype extends Cloneable {
    Prototype clone();
}

class Resume implements Prototype {
    private String name;
    private String workExperience;
    
    public Resume(String name) {
        this.name = name;
    }
    
    public void setWorkExperience(String workExperience) {
        this.workExperience = workExperience;
    }
    
    public Prototype clone() {
        Resume resume = new Resume(this.name);
        resume.setWorkExperience(this.workExperience);
        return resume;
    }
}

// 使用
Resume resumeA = new Resume("张三");
resumeA.setWorkExperience("腾讯-高级工程师");
Resume resumeB = (Resume) resumeA.clone();
```

4. 结构型模式 (7种)
结构型模式关注如何将类或对象组合成更大的结构。

4.1 适配器模式 (Adapter)
转换接口使其兼容

```
// 目标接口
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// 被适配的类
class AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("播放vlc文件: " + fileName);
    }
}

// 适配器
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;
    
    public MediaAdapter() {
        advancedPlayer = new AdvancedMediaPlayer();
    }
    
    public void play(String audioType, String fileName) {
        if(audioType.equalsIgnoreCase("vlc")){
            advancedPlayer.playVlc(fileName);
        }
    }
}
```

4.2 桥接模式 (Bridge)
分离抽象和实现

```
// 实现接口
interface DrawAPI {
    void drawCircle(int radius, int x, int y);
}

// 具体实现
class RedCircle implements DrawAPI {
    public void drawCircle(int radius, int x, int y) {
        System.out.println("红色圆 [半径: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

// 抽象类
abstract class Shape {
    protected DrawAPI drawAPI;
    
    protected Shape(DrawAPI drawAPI) {
        this.drawAPI = drawAPI;
    }
    
    public abstract void draw();
}

// 扩充抽象类
class Circle extends Shape {
    private int x, y, radius;
    
    public Circle(int x, int y, int radius, DrawAPI drawAPI) {
        super(drawAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    public void draw() {
        drawAPI.drawCircle(radius, x, y);
    }
}
```

4.3 组合模式 (Composite)
处理树形结构

```
interface FileSystemComponent {
    void display();
}

class File implements FileSystemComponent {
    private String name;
    
    public File(String name) {
        this.name = name;
    }
    
    public void display() {
        System.out.println("文件: " + name);
    }
}

class Directory implements FileSystemComponent {
    private String name;
    private List<FileSystemComponent> children = new ArrayList<>();
    
    public Directory(String name) {
        this.name = name;
    }
    
    public void add(FileSystemComponent component) {
        children.add(component);
    }
    
    public void display() {
        System.out.println("目录: " + name);
        for (FileSystemComponent component : children) {
            component.display();
        }
    }
}
```

4.4 装饰器模式 (Decorator)
动态添加功能

```
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
    }
    
    public void start() {
        System.out.println("电脑启动中...");
        cpu.start();
        memory.load();
        System.out.println("电脑启动完成");
    }
}

// 使用
ComputerFacade computer = new ComputerFacade();
computer.start();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
4.6 享元模式 (Flyweight)
共享细粒度对象

interface Shape {
    void draw();
}

class Circle implements Shape {
    private String color;
    private int x, y, radius;
    
    public Circle(String color) {
        this.color = color;
    }
    
    public void setAttributes(int x, int y, int radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    public void draw() {
        System.out.println("画圆 [颜色: " + color + ", x: " + x + ", y: " + y + "]");
    }
}

class ShapeFactory {
    private static final Map<String, Shape> circleMap = new HashMap<>();
    
    public static Shape getCircle(String color) {
        Circle circle = (Circle) circleMap.get(color);
        
        if (circle == null) {
            circle = new Circle(color);
            circleMap.put(color, circle);
            System.out.println("创建圆形，颜色: " + color);
        }
        return circle;
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
4.7 代理模式 (Proxy)
控制对象访问

interface Image {
    void display();
}

class RealImage implements Image {
    private String fileName;
    
    public RealImage(String fileName) {
        this.fileName = fileName;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("加载图片: " + fileName);
    }
    
    public void display() {
        System.out.println("显示图片: " + fileName);
    }
}

class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;
    
    public ProxyImage(String fileName) {
        this.fileName = fileName;
    }
    
    public void display() {
        if(realImage == null) {
            realImage = new RealImage(fileName); // 延迟加载
        }
        realImage.display();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
5. 行为型模式 (11种)
行为型模式关注对象之间的职责分配和算法抽象。

5.1 责任链模式 (Chain of Responsibility)
让多个处理器有机会处理请求

abstract class Logger {
    public static int INFO = 1;
    public static int DEBUG = 2;
    public static int ERROR = 3;
    
    protected int level;
    protected Logger nextLogger;
    
    public void setNextLogger(Logger nextLogger) {
        this.nextLogger = nextLogger;
    }
    
    public void logMessage(int level, String message) {
        if (this.level <= level) {
            write(message);
        }
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }
    
    abstract protected void write(String message);
}

class ConsoleLogger extends Logger {
    public ConsoleLogger(int level) {
        this.level = level;
    }
    
    protected void write(String message) {
        System.out.println("控制台日志: " + message);
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
5.2 命令模式 (Command)
将请求封装为对象

interface Command {
    void execute();
}

class Light {
    public void turnOn() {
        System.out.println("灯已打开");
    }
}

class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    public void execute() {
        light.turnOn();
    }
}

class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
5.3 解释器模式 (Interpreter)
定义语言的文法

interface Expression {
    boolean interpret(String context);
}

class TerminalExpression implements Expression {
    private String data;
    
    public TerminalExpression(String data) {
        this.data = data;
    }
    
    public boolean interpret(String context) {
        return context.contains(data);
    }
}

class OrExpression implements Expression {
    private Expression expr1;
    private Expression expr2;
    
    public OrExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
    
    public boolean interpret(String context) {
        return expr1.interpret(context) || expr2.interpret(context);
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
5.4 迭代器模式 (Iterator)
顺序访问集合元素

interface Iterator {
    boolean hasNext();
    Object next();
}

interface Container {
    Iterator getIterator();
}

class NameRepository implements Container {
    public String[] names = {"张三", "李四", "王五"};
    
    public Iterator getIterator() {
        return new NameIterator();
    }
    
    private class NameIterator implements Iterator {
        int index;
        
        public boolean hasNext() {
            return index < names.length;
        }
        
        public Object next() {
            if (this.hasNext()) {
                return names[index++];
            }
            return null;
        }
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
5.5 中介者模式 (Mediator)
封装对象交互

interface ChatMediator {
    void sendMessage(String msg, User user);
    void addUser(User user);
}

class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    
    public void addUser(User user) {
        this.users.add(user);
    }
    
    public void sendMessage(String msg, User user) {
        for (User u : this.users) {
            if (u != user) {
                u.receive(msg);
            }
        }
    }
}

abstract class User {
    protected ChatMediator mediator;
    protected String name;
    
    public User(ChatMediator med, String name) {
        this.mediator = med;
        this.name = name;
    }
    
    public abstract void send(String msg);
    public abstract void receive(String msg);
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
5.6 备忘录模式 (Memento)
保存和恢复对象状态

class Memento {
    private String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

class Originator {
    private String state;
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    public Memento saveStateToMemento() {
        return new Memento(state);
    }
    
    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
5.7 观察者模式 (Observer)
一对多依赖关系

interface Subject {
    void registerObserver(Observer o);
    void removeObserver(Observer o);
    void notifyObservers();
}

interface Observer {
    void update(float temperature);
}

class WeatherStation implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private float temperature;
    
    public void registerObserver(Observer o) {
        observers.add(o);
    }
    
    public void removeObserver(Observer o) {
        observers.remove(o);
    }
    
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(temperature);
        }
    }
    
    public void setTemperature(float temperature) {
        this.temperature = temperature;
        notifyObservers();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
5.8 状态模式 (State)
根据状态改变行为

interface State {
    void handle(Context context);
}

class StartState implements State {
    public void handle(Context context) {
        System.out.println("玩家处于开始状态");
        context.setState(this);
    }
}

class StopState implements State {
    public void handle(Context context) {
        System.out.println("玩家处于停止状态");
        context.setState(this);
    }
}

class Context {
    private State state;
    
    public void setState(State state) {
        this.state = state;
    }
    
    public State getState() {
        return state;
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
5.9 策略模式 (Strategy)
封装可互换的算法

interface PaymentStrategy {
    void pay(int amount);
}

class CreditCardStrategy implements PaymentStrategy {
    private String cardNumber;
    
    public CreditCardStrategy(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public void pay(int amount) {
        System.out.println("信用卡支付 " + amount + " 元");
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
5.10 模板方法模式 (Template Method)
定义算法骨架

abstract class Game {
    // 模板方法
    public final void play() {
        initialize();
        startPlay();
        endPlay();
    }
    
    abstract void initialize();
    abstract void startPlay();
    abstract void endPlay();
}

class Cricket extends Game {
    void initialize() {
        System.out.println("板球游戏初始化");
    }
    
    void startPlay() {
        System.out.println("板球游戏开始");
    }
    
    void endPlay() {
        System.out.println("板球游戏结束");
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
5.11 访问者模式 (Visitor)
在不修改类的前提下定义新操作

interface ComputerPart {
    void accept(ComputerPartVisitor visitor);
}

class Keyboard implements ComputerPart {
    public void accept(ComputerPartVisitor visitor) {
        visitor.visit(this);
    }
}

interface ComputerPartVisitor {
    void visit(Keyboard keyboard);
    void visit(Monitor monitor);
}

class ComputerPartDisplayVisitor implements ComputerPartVisitor {
    public void visit(Keyboard keyboard) {
        System.out.println("显示键盘");
    }
    
    public void visit(Monitor monitor) {
        System.out.println("显示显示器");
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
6. 设计模式的应用实践
6.1 如何选择合适的设计模式？
问题场景	推荐模式	说明
需要控制实例数量	单例模式	如数据库连接池
创建复杂对象	建造者模式	如创建复杂配置对象
处理不兼容接口	适配器模式	如集成第三方库
动态添加功能	装饰器模式	如Java IO流
实现事件通知	观察者模式	如消息推送系统
封装算法族	策略模式	如支付方式选择
6.2 Spring框架中的设计模式应用
Spring框架大量使用了设计模式：

工厂模式：BeanFactory
单例模式：默认的Bean作用域
代理模式：AOP实现
模板方法：JdbcTemplate
观察者模式：ApplicationEvent
// Spring中的观察者模式示例
@Component
public class MyEventListener implements ApplicationListener<MyEvent> {
    @Override
    public void onApplicationEvent(MyEvent event) {
        // 处理事件
    }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
8
6.3 避免过度设计
设计模式是工具，不是目标。错误的使用会导致：

不必要的复杂性
性能下降
学习成本增加
正确做法：

从简单设计开始
在真正需要时引入模式
优先使用组合而不是继承
保持代码的可读性
7. 总结
设计模式是软件工程师的宝贵财富，但掌握它们需要：

理解原则：深入理解七大设计原则
实践应用：在真实项目中应用模式
持续学习：关注新模式和最佳实践
保持平衡：避免过度设计和模式滥用
记住，优秀的软件设计是简单性、灵活性和可维护性的平衡。设计模式为我们提供了达到这种平衡的工具和方法。

参考资料：

《设计模式：可复用面向对象软件的基础》
《Head First设计模式》
《重构：改善既有代码的设计》
希望本文能帮助你在设计模式的学习道路上更进一步！

您提出了一个很好的观察。确实，在不同的资料和版本中，设计模式的原则有时会有不同的组合。让我来澄清这个问题。

设计模式原则的不同版本
版本一：SOLID + 迪米特法则（6大原则）
这是最经典的版本，包括：

单一职责原则 (SRP)
开闭原则 (OCP)
里氏替换原则 (LSP)
接口隔离原则 (ISP)
依赖倒置原则 (DIP)
迪米特法则 (LoD)
版本二：包含合成复用原则的6大原则
有些资料确实会用合成复用原则替换开闭原则，形成：

单一职责原则 (SRP)
合成复用原则 (CRP)
里氏替换原则 (LSP)
接口隔离原则 (ISP)
依赖倒置原则 (DIP)
迪米特法则 (LoD)
合成复用原则详解
定义
合成复用原则 (Composite Reuse Principle, CRP)：

优先使用对象组合/聚合，而不是继承来达到复用的目的。

核心思想
组合优于继承：通过包含其他对象来实现功能，而不是通过继承
降低耦合度：组合关系比继承关系更加灵活
提高复用性：可以动态替换组件，而继承是静态的
代码示例对比
继承方式（不推荐）：

// 基类
class Vehicle {
    void startEngine() {
        System.out.println("启动引擎");
    }
}

// 子类继承
class Car extends Vehicle {
    // Car继承了startEngine方法
}

// 电动车不需要引擎，但被迫继承
class ElectricCar extends Vehicle {
    // 问题：电动车没有引擎，但被迫继承startEngine方法
    @Override
    void startEngine() {
        // 需要重写或抛出异常，违反里氏替换原则
        throw new UnsupportedOperationException("电动车没有引擎");
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
组合方式（推荐）：

// 引擎接口
interface Engine {
    void start();
}

// 具体引擎实现
class GasolineEngine implements Engine {
    public void start() {
        System.out.println("启动汽油引擎");
    }
}

class ElectricMotor implements Engine {
    public void start() {
        System.out.println("启动电动马达");
    }
}

// 车辆类使用组合
class Vehicle {
    protected Engine engine;
    
    public Vehicle(Engine engine) {
        this.engine = engine; // 组合而不是继承
    }
    
    public void start() {
        engine.start();
    }
    
    // 可以动态更换引擎
    public void setEngine(Engine engine) {
        this.engine = engine;
    }
}

// 使用
Vehicle gasolineCar = new Vehicle(new GasolineEngine());
Vehicle electricCar = new Vehicle(new ElectricMotor());

gasolineCar.start(); // 启动汽油引擎
electricCar.start(); // 启动电动马达
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
为什么会有不同的原则组合？
历史演变
SOLID原则：由Robert C. Martin提出，主要关注面向对象设计的核心问题
合成复用原则：更早被认识到的重要原则，特别是在实践中发现继承的局限性后
不同侧重点：
SOLID：更全面，涵盖设计各个方面
包含CRP的版本：更强调代码复用的实践指导
实际应用中的选择
在实际开发中，很多团队会综合参考这些原则：

// 同时遵循多个原则的示例
class ReportGenerator {
    private final DataFetcher dataFetcher;      // 组合而非继承 (CRP)
    private final Formatter formatter;          // 依赖抽象 (DIP)
    
    // 单一职责：只负责生成报告 (SRP)
    public ReportGenerator(DataFetcher fetcher, Formatter formatter) {
        this.dataFetcher = fetcher;
        this.formatter = formatter;
    }
    
    public String generateReport() {
        Object data = dataFetcher.fetch();      // 最少知识原则 (LoD)
        return formatter.format(data);          // 对扩展开放 (OCP)
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
完整的设计模式原则体系
考虑到全面性，现代软件开发通常会参考7大原则：

单一职责原则 (SRP)
开闭原则 (OCP)
里氏替换原则 (LSP)
接口隔离原则 (ISP)
依赖倒置原则 (DIP)
迪米特法则 (LoD)
合成复用原则 (CRP)
各原则的关联性
这些原则相互支持，形成一个完整体系：

SRP 和 ISP 确保类的内聚性
OCP 和 DIP 确保系统的扩展性
LSP 确保继承关系的正确性
LoD 和 CRP 确保对象间的松耦合
结论
您提到的包含合成复用原则的版本确实是存在的，特别是在一些强调实践性的资料中。这种版本更直接地强调了"组合优于继承"这一重要实践原则。

建议的学习路径：

首先理解SOLID + LoD的经典6原则
在此基础上重点掌握合成复用原则
在实际项目中综合应用这些原则
两种版本都有其价值，关键是理解每个原则背后的设计思想，而不是纠结于具体的数量或组合。优秀的软件设计往往是这些原则的综合体现。


设计模式全解析：构建可维护软件的核心蓝图
引言：设计模式的起源与价值
在软件工程领域，设计模式是解决常见设计问题的经典方案模板。这一概念最初由建筑师克里斯托弗·亚历山大提出，后被"四人帮"（Erich Gamma、Richard Helm、Ralph Johnson和John Vlissides）引入软件开发领域，并在1994年的著作《设计模式：可复用面向对象软件的基础》中系统化地提出了23种经典设计模式。

设计模式的核心价值在于：

提供共享词汇：让开发团队能够高效沟通复杂设计概念
促进代码复用：经过验证的解决方案可以直接应用
提高可维护性：遵循良好设计原则的代码更易于理解和修改
加速开发过程：避免重复解决相同问题
设计模式的六大原则：SOLID + 迪米特法则
在深入具体模式之前，必须理解支撑所有设计模式的六大核心原则：

1. 单一职责原则 (SRP)
一个类应该只有一个引起变化的原因
这意味着每个类应该专注于单一功能领域，避免承担过多职责。例如，一个负责用户数据管理的类不应该同时处理数据验证和网络通信。

2. 开闭原则 (OCP)
对扩展开放，对修改关闭
软件实体应该允许在不修改现有代码的情况下扩展功能。这通常通过抽象化和多态实现。

3. 里氏替换原则 (LSP)
子类必须能够替换它们的基类
继承应该确保父类可以被任何子类替换，而不会破坏程序功能。这是实现多态的基础。

4. 接口隔离原则 (ISP)
客户端不应该被迫依赖它们不使用的接口
应该创建特定、专注的接口，而不是庞大臃肿的通用接口。

5. 依赖倒置原则 (DIP)
依赖抽象而不是具体实现
高层模块不应该依赖低层模块，两者都应该依赖于抽象。

6. 迪米特法则 (LoD)
只与直接的朋友通信
对象应该对其他对象保持最少的了解，降低耦合度。

这些原则共同构成了"高内聚、低耦合"的设计理念，是所有设计模式的指导思想。

设计模式的三大分类
创建型模式：对象创建的艺术
创建型模式关注对象的实例化过程，将系统与对象的创建、组合方式解耦。

单例模式确保类只有一个实例，如数据库连接池：

public class DatabaseConnection {
    private static DatabaseConnection instance;
    
    private DatabaseConnection() {} // 私有构造函数
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
工厂方法模式让子类决定实例化哪个类，提供扩展点：

abstract class Dialog {
    public abstract Button createButton();
    
    public void render() {
        Button button = createButton();
        button.onClick("closeDialog");
        button.render();
    }
}

class WindowsDialog extends Dialog {
    public Button createButton() {
        return new WindowsButton();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
抽象工厂模式创建相关对象家族，确保产品兼容性：

interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
8
9
建造者模式分步骤构建复杂对象，特别适用于包含多个组成部分的对象：

Computer computer = new Computer.Builder()
    .setCPU("Intel i7")
    .setRAM("16GB")
    .setStorage("1TB SSD")
    .build();
一键获取完整项目代码
java
1
2
3
4
5
原型模式通过拷贝现有对象创建新对象，避免昂贵的初始化过程：

Shape original = new Circle("red", 10);
Shape clone = original.clone();
一键获取完整项目代码
java
1
2
结构型模式：构建灵活架构
结构型模式关注类和对象的组合方式，形成更大的结构。

适配器模式解决接口不兼容问题：

class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;
    
    public void play(String audioType, String fileName) {
        if(audioType.equals("vlc")){
            advancedPlayer.playVlc(fileName);
        }
    }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
8
9
装饰器模式动态添加功能，替代继承：

Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee); // 添加牛奶
coffee = new SugarDecorator(coffee); // 添加糖
一键获取完整项目代码
java
1
2
3
代理模式控制对象访问，实现延迟加载或访问控制：

class ProxyImage implements Image {
    private RealImage realImage;
    
    public void display() {
        if(realImage == null) {
            realImage = new RealImage("large_image.jpg"); // 延迟加载
        }
        realImage.display();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
外观模式为复杂子系统提供统一接口：

class ComputerFacade {
    public void start() {
        cpu.start();
        memory.load();
        hardDrive.read();
    }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
组合模式处理树形结构，统一对待单个对象和对象组合：

interface FileSystemComponent {
    void display();
}

class File implements FileSystemComponent {
    public void display() { /* 显示文件 */ }
}

class Directory implements FileSystemComponent {
    private List<FileSystemComponent> children = new ArrayList<>();
    public void display() { 
        for (FileSystemComponent child : children) {
            child.display();
        }
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
行为型模式：对象间的优雅协作
行为型模式关注对象之间的职责分配和算法抽象。

观察者模式实现发布-订阅机制：

class WeatherStation implements Subject {
    private List<Observer> observers = new ArrayList<>();
    
    public void setTemperature(float temp) {
        this.temperature = temp;
        notifyObservers(); // 通知所有观察者
    }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
8
策略模式封装可互换的算法族：

class ShoppingCart {
    private PaymentStrategy strategy;
    
    public void checkout(int amount) {
        strategy.pay(amount); // 使用当前策略支付
    }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
命令模式将请求封装为对象，支持撤销、队列等功能：

interface Command {
    void execute();
    void undo();
}

class LightOnCommand implements Command {
    private Light light;
    
    public void execute() {
        light.turnOn();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
状态模式根据状态改变行为：

class Context {
    private State state;
    
    public void request() {
        state.handle(); // 委托给当前状态处理
    }
}
一键获取完整项目代码
java
1
2
3
4
5
6
7
模板方法模式定义算法骨架，子类重定义特定步骤：

abstract class DataProcessor {
    // 模板方法
    public final void process() {
        readData();
        processData(); // 抽象方法，子类实现
        saveData();
    }
    
    protected abstract void processData();
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
UML：设计模式的可视化语言
统一建模语言（UML）是描述设计模式的标准工具，主要使用类图和序列图：

类图展示静态结构
Syntax error in text
mermaid version 10.9.1
序列图展示动态交互
Syntax error in text
mermaid version 10.9.1
UML图使设计模式的结构和交互关系一目了然，是团队沟通和文档化的重要工具。

设计模式的实际应用场景
Web开发中的模式应用
MVC架构：结合多种模式（观察者、策略、组合）
中间件链：责任链模式处理HTTP请求
依赖注入：工厂模式和单例模式的现代应用
微服务架构中的模式
API网关：外观模式为客户端提供统一入口
服务发现：结合单例和观察者模式
断路器：状态模式管理服务可用性
移动应用开发
Reactive编程：观察者模式的扩展应用
View层架构：组合模式构建UI层次结构
数据持久化：代理模式实现缓存和延迟加载
选择合适的设计模式
何时使用特定模式
需要控制实例数量 → 单例模式
创建复杂对象 → 建造者模式
处理接口不兼容 → 适配器模式
动态添加功能 → 装饰器模式
实现事件通知 → 观察者模式
封装算法 → 策略模式
避免过度设计
设计模式是工具而非目标，错误应用会导致：

不必要的复杂性
性能开销
学习曲线陡峭
正确态度：从简单设计开始，在真正需要时引入模式。

现代开发中的设计模式演进
函数式编程的影响
现代语言如JavaScript、Python、Kotlin等引入了函数式编程概念，为传统设计模式提供了新的实现方式：

// 策略模式的函数式实现
const paymentStrategies = {
    creditCard: (amount) => { /* 信用卡支付 */ },
    paypal: (amount) => { /* PayPal支付 */ }
};

const checkout = (amount, strategy) => strategy(amount);
一键获取完整项目代码
javascript
1
2
3
4
5
6
7
响应式编程模式
RxJS、Reactor等库将观察者模式提升到新高度，提供强大的数据流处理能力。

云原生模式
在微服务和云原生架构中，出现了如Sidecar、Ambassador等新的模式，扩展了传统设计模式的应用范围。

结论：掌握设计模式的艺术
设计模式不是银弹，而是经验丰富的开发者总结出的最佳实践工具箱。真正掌握设计模式需要：

理解原则而非死记硬背：明白每个模式解决的问题和适用场景
在实践中学习：在真实项目中应用和调整模式
保持简单：优先选择简单解决方案，必要时才引入复杂模式
持续学习：关注新模式和现有模式的演进
正如建筑大师克里斯托弗·亚历山大所说：“每个模式描述了一个在我们周围不断重复发生的问题，以及该问题的解决方案的核心。这样，你就能一次又一次地使用该方案而不必做重复劳动。”

在快速变化的技术世界中，设计模式提供的核心设计智慧将继续指导我们构建健壮、可维护的软件系统。它们是连接软件工程理论与实践的重要桥梁，是每位严肃开发者都应该掌握的基本功。

通过深入理解这23种经典设计模式，开发者不仅能够写出更好的代码，更能够培养出解决复杂设计问题的系统性思维，这是在职业生涯中持续成长的关键能力。

好的，下面为23种经典设计模式提供具体的代码示例说明（使用Java语言）。

创建型模式
1. 单例模式 (Singleton)
确保一个类只有一个实例

public class Singleton {
    private static Singleton instance;
    
    private Singleton() {} // 私有构造函数
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
    
    public void showMessage() {
        System.out.println("Hello Singleton!");
    }
}

// 使用
Singleton singleton = Singleton.getInstance();
singleton.showMessage();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
2. 工厂方法模式 (Factory Method)
让子类决定实例化哪个类

// 产品接口
interface Product {
    void use();
}

// 具体产品
class ConcreteProduct implements Product {
    public void use() {
        System.out.println("使用具体产品");
    }
}

// 工厂抽象类
abstract class Creator {
    public abstract Product factoryMethod();
    
    public void someOperation() {
        Product product = factoryMethod();
        product.use();
    }
}

// 具体工厂
class ConcreteCreator extends Creator {
    public Product factoryMethod() {
        return new ConcreteProduct();
    }
}

// 使用
Creator creator = new ConcreteCreator();
creator.someOperation();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
3. 抽象工厂模式 (Abstract Factory)
创建相关对象的家族

// 抽象产品
interface Button {
    void paint();
}

interface Checkbox {
    void paint();
}

// 具体产品
class WindowsButton implements Button {
    public void paint() {
        System.out.println("渲染Windows风格按钮");
    }
}

class MacButton implements Button {
    public void paint() {
        System.out.println("渲染Mac风格按钮");
    }
}

// 抽象工厂
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// 具体工厂
class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton();
    }
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
4. 建造者模式 (Builder)
分步骤构建复杂对象

class Computer {
    private String CPU;
    private String RAM;
    private String storage;
    
    // 建造者
    public static class Builder {
        private String CPU;
        private String RAM;
        private String storage;
        
        public Builder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }
        
        public Builder setRAM(String RAM) {
            this.RAM = RAM;
            return this;
        }
        
        public Builder setStorage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
    }
}

// 使用
Computer computer = new Computer.Builder()
    .setCPU("Intel i7")
    .setRAM("16GB")
    .setStorage("1TB SSD")
    .build();
```

# 2. 设计原则 (5种)

设计原则是设计模式背后的指导思想，帮助我们编写更好的代码。

## 2.1 单一职责原则 (SRP)

一个类应该只有一个改变的原因。

```

    .setCPU("Intel i7")
    .setRAM("16GB")
    .setStorage("1TB SSD")
    .build();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
5. 原型模式 (Prototype)
通过拷贝创建新对象

interface Prototype extends Cloneable {
    Prototype clone();
}

class ConcretePrototype implements Prototype {
    private String field;
    
    public ConcretePrototype(String field) {
        this.field = field;
    }
    
    public Prototype clone() {
        return new ConcretePrototype(this.field);
    }
    
    public String getField() {
        return field;
    }
}

// 使用
ConcretePrototype original = new ConcretePrototype("原始数据");
ConcretePrototype copy = (ConcretePrototype) original.clone();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
结构型模式
6. 适配器模式 (Adapter)
转换接口

// 目标接口
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// 被适配的类
class AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("播放vlc文件: " + fileName);
    }
}

// 适配器
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedMusicPlayer;
    
    public MediaAdapter() {
        advancedMusicPlayer = new AdvancedMediaPlayer();
    }
    
    public void play(String audioType, String fileName) {
        if(audioType.equalsIgnoreCase("vlc")){
            advancedMusicPlayer.playVlc(fileName);
        }
    }
}

// 使用
MediaPlayer player = new MediaAdapter();
player.play("vlc", "movie.vlc");
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
7. 装饰器模式 (Decorator)
动态添加功能

// 组件接口
interface Coffee {
    double getCost();
    String getDescription();
}

// 具体组件
class SimpleCoffee implements Coffee {
    public double getCost() {
        return 1.0;
    }
    public String getDescription() {
        return "简单咖啡";
    }
}

// 装饰器
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    public double getCost() {
        return decoratedCoffee.getCost();
    }
    
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    public double getCost() {
        return super.getCost() + 0.5;
    }
    
    public String getDescription() {
        return super.getDescription() + ", 加牛奶";
    }
}

// 使用
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee); // 装饰
System.out.println(coffee.getDescription() + " 价格: $" + coffee.getCost());
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
8. 代理模式 (Proxy)
控制对象访问

interface Image {
    void display();
}

class RealImage implements Image {
    private String fileName;
    
    public RealImage(String fileName) {
        this.fileName = fileName;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("加载图片: " + fileName);
    }
    
    public void display() {
        System.out.println("显示图片: " + fileName);
    }
}

class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;
    
    public ProxyImage(String fileName) {
        this.fileName = fileName;
    }
    
    public void display() {
        if(realImage == null) {
            realImage = new RealImage(fileName); // 延迟加载
        }
        realImage.display();
    }
}

// 使用
Image image = new ProxyImage("test.jpg");
image.display(); // 此时才真正加载图片
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
行为型模式
9. 观察者模式 (Observer)
一对多依赖关系

import java.util.*;

// 主题接口
interface Subject {
    void registerObserver(Observer o);
    void removeObserver(Observer o);
    void notifyObservers();
}

// 观察者接口
interface Observer {
    void update(float temperature);
}

// 具体主题
class WeatherStation implements Subject {
    private List<Observer> observers;
    private float temperature;
    
    public WeatherStation() {
        observers = new ArrayList<>();
    }
    
    public void registerObserver(Observer o) {
        observers.add(o);
    }
    
    public void removeObserver(Observer o) {
        observers.remove(o);
    }
    
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(temperature);
        }
    }
    
    public void setTemperature(float temperature) {
        this.temperature = temperature;
        notifyObservers();
    }
}

// 具体观察者
class Display implements Observer {
    private String name;
    
    public Display(String name) {
        this.name = name;
    }
    
    public void update(float temperature) {
        System.out.println(name + " 显示温度: " + temperature);
    }
}

// 使用
WeatherStation station = new WeatherStation();
station.registerObserver(new Display("手机"));
station.registerObserver(new Display("电脑"));
station.setTemperature(25.5f); // 所有观察者都会收到通知
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
10. 策略模式 (Strategy)
封装可互换的算法

// 策略接口
interface PaymentStrategy {
    void pay(int amount);
}

// 具体策略
class CreditCardStrategy implements PaymentStrategy {
    private String cardNumber;
    
    public CreditCardStrategy(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public void pay(int amount) {
        System.out.println("信用卡支付 " + amount + " 元，卡号: " + cardNumber);
    }
}

class PayPalStrategy implements PaymentStrategy {
    private String email;
    
    public PayPalStrategy(String email) {
        this.email = email;
    }
    
    public void pay(int amount) {
        System.out.println("PayPal支付 " + amount + " 元，邮箱: " + email);
    }
}

// 上下文
class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// 使用
ShoppingCart cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardStrategy("1234-5678-9012-3456"));
cart.checkout(100);

cart.setPaymentStrategy(new PayPalStrategy("user@example.com"));
cart.checkout(200);
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
11. 命令模式 (Command)
将请求封装为对象

// 命令接口
interface Command {
    void execute();
}

// 接收者
class Light {
    public void turnOn() {
        System.out.println("灯已打开");
    }
    
    public void turnOff() {
        System.out.println("灯已关闭");
    }
}

// 具体命令
class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    public void execute() {
        light.turnOn();
    }
}

// 调用者
class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
}

// 使用
Light light = new Light();
Command lightOn = new LightOnCommand(light);
RemoteControl remote = new RemoteControl();
remote.setCommand(lightOn);
remote.pressButton(); // 执行命令
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
12. 状态模式 (State)
根据状态改变行为

// 状态接口
interface State {
    void handle(Context context);
}

// 具体状态
class StartState implements State {
    public void handle(Context context) {
        System.out.println("玩家处于开始状态");
        context.setState(this);
    }
    
    public String toString() {
        return "开始状态";
    }
}

class StopState implements State {
    public void handle(Context context) {
        System.out.println("玩家处于停止状态");
        context.setState(this);
    }
    
    public String toString() {
        return "停止状态";
    }
}

// 上下文
class Context {
    private State state;
    
    public Context() {
        state = null;
    }
    
    public void setState(State state) {
        this.state = state;
    }
    
    public State getState() {
        return state;
    }
}

// 使用
Context context = new Context();
StartState startState = new StartState();
startState.handle(context); // 切换到开始状态
System.out.println(context.getState());

StopState stopState = new StopState();
stopState.handle(context); // 切换到停止状态
System.out.println(context.getState());
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
13. 责任链模式 (Chain of Responsibility)
让多个处理器有机会处理请求

abstract class Logger {
    public static int INFO = 1;
    public static int DEBUG = 2;
    public static int ERROR = 3;
    
    protected int level;
    protected Logger nextLogger;
    
    public void setNextLogger(Logger nextLogger) {
        this.nextLogger = nextLogger;
    }
    
    public void logMessage(int level, String message) {
        if (this.level <= level) {
            write(message);
        }
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }
    
    abstract protected void write(String message);
}

class ConsoleLogger extends Logger {
    public ConsoleLogger(int level) {
        this.level = level;
    }
    
    protected void write(String message) {
        System.out.println("控制台日志: " + message);
    }
}

class ErrorLogger extends Logger {
    public ErrorLogger(int level) {
        this.level = level;
    }
    
    protected void write(String message) {
        System.out.println("错误日志: " + message);
    }
}

// 使用
Logger loggerChain = new ErrorLogger(Logger.ERROR);
Logger consoleLogger = new ConsoleLogger(Logger.INFO);
loggerChain.setNextLogger(consoleLogger);

loggerChain.logMessage(Logger.INFO, "这是一条信息");
loggerChain.logMessage(Logger.ERROR, "这是一个错误");
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
14. 模板方法模式 (Template Method)
定义算法骨架

abstract class Game {
    // 模板方法
    public final void play() {
        initialize();
        startPlay();
        endPlay();
    }
    
    abstract void initialize();
    abstract void startPlay();
    abstract void endPlay();
}

class Cricket extends Game {
    void initialize() {
        System.out.println("板球游戏初始化");
    }
    
    void startPlay() {
        System.out.println("板球游戏开始");
    }
    
    void endPlay() {
        System.out.println("板球游戏结束");
    }
}

class Football extends Game {
    void initialize() {
        System.out.println("足球游戏初始化");
    }
    
    void startPlay() {
        System.out.println("足球游戏开始");
    }
    
    void endPlay() {
        System.out.println("足球游戏结束");
    }
}

// 使用
Game game = new Cricket();
game.play(); // 执行模板方法

game = new Football();
game.play();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
15. 访问者模式 (Visitor)
在不修改类的前提下定义新操作

interface ComputerPart {
    void accept(ComputerPartVisitor visitor);
}

class Keyboard implements ComputerPart {
    public void accept(ComputerPartVisitor visitor) {
        visitor.visit(this);
    }
}

class Monitor implements ComputerPart {
    public void accept(ComputerPartVisitor visitor) {
        visitor.visit(this);
    }
}

interface ComputerPartVisitor {
    void visit(Keyboard keyboard);
    void visit(Monitor monitor);
}

class ComputerPartDisplayVisitor implements ComputerPartVisitor {
    public void visit(Keyboard keyboard) {
        System.out.println("显示键盘");
    }
    
    public void visit(Monitor monitor) {
        System.out.println("显示显示器");
    }
}

// 使用
ComputerPart[] parts = {new Keyboard(), new Monitor()};
ComputerPartVisitor visitor = new ComputerPartDisplayVisitor();

for (ComputerPart part : parts) {
    part.accept(visitor);
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
16. 中介者模式 (Mediator)
封装对象交互

import java.util.*;

interface ChatMediator {
    void sendMessage(String msg, User user);
    void addUser(User user);
}

class ChatRoom implements ChatMediator {
    private List<User> users;
    
    public ChatRoom() {
        this.users = new ArrayList<>();
    }
    
    public void addUser(User user) {
        this.users.add(user);
    }
    
    public void sendMessage(String msg, User user) {
        for (User u : this.users) {
            if (u != user) {
                u.receive(msg);
            }
        }
    }
}

abstract class User {
    protected ChatMediator mediator;
    protected String name;
    
    public User(ChatMediator med, String name) {
        this.mediator = med;
        this.name = name;
    }
    
    public abstract void send(String msg);
    public abstract void receive(String msg);
}

class ConcreteUser extends User {
    public ConcreteUser(ChatMediator med, String name) {
        super(med, name);
    }
    
    public void send(String msg) {
        System.out.println(this.name + " 发送: " + msg);
        mediator.sendMessage(msg, this);
    }
    
    public void receive(String msg) {
        System.out.println(this.name + " 收到: " + msg);
    }
}

// 使用
ChatMediator chatRoom = new ChatRoom();
User user1 = new ConcreteUser(chatRoom, "张三");
User user2 = new ConcreteUser(chatRoom, "李四");
chatRoom.addUser(user1);
chatRoom.addUser(user2);

user1.send("大家好！");
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
17. 备忘录模式 (Memento)
保存和恢复对象状态

class Memento {
    private String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

class Originator {
    private String state;
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    public Memento saveStateToMemento() {
        return new Memento(state);
    }
    
    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

class CareTaker {
    private List<Memento> mementoList = new ArrayList<>();
    
    public void add(Memento state) {
        mementoList.add(state);
    }
    
    public Memento get(int index) {
        return mementoList.get(index);
    }
}

// 使用
Originator originator = new Originator();
CareTaker careTaker = new CareTaker();

originator.setState("状态 #1");
originator.setState("状态 #2");
careTaker.add(originator.saveStateToMemento()); // 保存状态

originator.setState("状态 #3");
careTaker.add(originator.saveStateToMemento()); // 保存状态

// 恢复状态
originator.getStateFromMemento(careTaker.get(0));
System.out.println("第一个保存的状态: " + originator.getState());
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
18. 迭代器模式 (Iterator)
顺序访问集合元素

interface Iterator {
    boolean hasNext();
    Object next();
}

interface Container {
    Iterator getIterator();
}

class NameRepository implements Container {
    public String[] names = {"张三", "李四", "王五"};
    
    public Iterator getIterator() {
        return new NameIterator();
    }
    
    private class NameIterator implements Iterator {
        int index;
        
        public boolean hasNext() {
            return index < names.length;
        }
        
        public Object next() {
            if (this.hasNext()) {
                return names[index++];
            }
            return null;
        }
    }
}

// 使用
NameRepository namesRepository = new NameRepository();
Iterator iter = namesRepository.getIterator();

while (iter.hasNext()) {
    String name = (String) iter.next();
    System.out.println("名字: " + name);
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
19. 解释器模式 (Interpreter)
定义语言的文法

interface Expression {
    boolean interpret(String context);
}

class TerminalExpression implements Expression {
    private String data;
    
    public TerminalExpression(String data) {
        this.data = data;
    }
    
    public boolean interpret(String context) {
        return context.contains(data);
    }
}

class OrExpression implements Expression {
    private Expression expr1;
    private Expression expr2;
    
    public OrExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
    
    public boolean interpret(String context) {
        return expr1.interpret(context) || expr2.interpret(context);
    }
}

// 使用
Expression isMale = new TerminalExpression("男");
Expression isMarried = new TerminalExpression("已婚");
Expression isMarriedMale = new OrExpression(isMale, isMarried);

System.out.println("张三是男性吗? " + isMale.interpret("张三 男"));
System.out.println("李四已婚或是男性吗? " + isMarriedMale.interpret("李四 已婚"));
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
20. 享元模式 (Flyweight)
共享细粒度对象

import java.util.*;

interface Shape {
    void draw();
}

class Circle implements Shape {
    private String color;
    private int x, y, radius;
    
    public Circle(String color) {
        this.color = color;
    }
    
    public void setX(int x) {
        this.x = x;
    }
    
    public void setY(int y) {
        this.y = y;
    }
    
    public void setRadius(int radius) {
        this.radius = radius;
    }
    
    public void draw() {
        System.out.println("画圆 [颜色: " + color + ", x: " + x + ", y: " + y + ", 半径: " + radius + "]");
    }
}

class ShapeFactory {
    private static final HashMap<String, Shape> circleMap = new HashMap<>();
    
    public static Shape getCircle(String color) {
        Circle circle = (Circle) circleMap.get(color);
        
        if (circle == null) {
            circle = new Circle(color);
            circleMap.put(color, circle);
            System.out.println("创建圆形，颜色: " + color);
        }
        return circle;
    }
}

// 使用
String[] colors = {"红色", "绿色", "蓝色", "红色", "绿色"};
for (String color : colors) {
    Circle circle = (Circle) ShapeFactory.getCircle(color);
    circle.setX((int)(Math.random() * 100));
    circle.setY((int)(Math.random() * 100));
    circle.setRadius(100);
    circle.draw();
}
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
21. 桥接模式 (Bridge)
分离抽象和实现

// 实现接口
interface DrawAPI {
    void drawCircle(int radius, int x, int y);
}

class RedCircle implements DrawAPI {
    public void drawCircle(int radius, int x, int y) {
        System.out.println("画红色圆 [半径: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

class GreenCircle implements DrawAPI {
    public void drawCircle(int radius, int x, int y) {
        System.out.println("画绿色圆 [半径: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

// 抽象类
abstract class Shape {
    protected DrawAPI drawAPI;
    
    protected Shape(DrawAPI drawAPI) {
        this.drawAPI = drawAPI;
    }
    
    public abstract void draw();
}

// 扩充抽象类
class Circle extends Shape {
    private int x, y, radius;
    
    public Circle(int x, int y, int radius, DrawAPI drawAPI) {
        super(drawAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    public void draw() {
        drawAPI.drawCircle(radius, x, y);
    }
}

// 使用
Shape redCircle = new Circle(100, 100, 10, new RedCircle());
Shape greenCircle = new Circle(100, 100, 10, new GreenCircle());
redCircle.draw();
greenCircle.draw();
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
22. 组合模式 (Composite)
处理树形结构

import java.util.*;

interface Employee {
    void showEmployeeDetails();
}

class Developer implements Employee {
    private String name;
    private String position;
    
    public Developer(String name, String position) {
        this.name = name;
        this.position = position;
    }
    
    public void showEmployeeDetails() {
        System.out.println(name + " - " + position);
    }
}

class Manager implements Employee {
    private String name;
    private String position;
    
    public Manager(String name, String position) {
        this.name = name;
        this.position = position;
    }
    
    public void showEmployeeDetails() {
        System.out.println(name + " - " + position);
    }
}

class CompanyDirectory implements Employee {
    private List<Employee> employeeList = new ArrayList<>();
    
    public void showEmployeeDetails() {
        for (Employee emp : employeeList) {
            emp.showEmployeeDetails();
        }
    }
    
    public void addEmployee(Employee emp) {
        employeeList.add(emp);
    }
    
    public void removeEmployee(Employee emp) {
        employeeList.remove(emp);
    }
}

// 使用
Developer dev1 = new Developer("张三", "高级开发");
Developer dev2 = new Developer("李四", "初级开发");
CompanyDirectory devDirectory = new CompanyDirectory();
devDirectory.addEmployee(dev1);
devDirectory.addEmployee(dev2);

Manager man1 = new Manager("王经理", "技术经理");
CompanyDirectory managerDirectory = new CompanyDirectory();
managerDirectory.addEmployee(man1);

CompanyDirectory directory = new CompanyDirectory();
directory.addEmployee(devDirectory);
directory.addEmployee(managerDirectory);
directory.showEmployeeDetails(); // 显示所有员工
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
23. 外观模式 (Facade)
简化复杂子系统

// 子系统类
class CPU {
    public void start() {
        System.out.println("CPU启动");
    }
}

class Memory {
    public void load() {
        System.out.println("内存加载");
    }
}

class HardDrive {
    public void read() {
        System.out.println("硬盘读取");
    }
}

// 外观类
class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    public void start() {
        System.out.println("电脑启动中...");
        cpu.start();
        memory.load();
        hardDrive.read();
        System.out.println("电脑启动完成");
    }
}

// 使用
ComputerFacade computer = new ComputerFacade();
computer.start(); // 客户端只需调用一个简单方法
一键获取完整项目代码
java

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
这些示例展示了23种设计模式在实际编程中的应用场景和实现方式。每个模式都解决了特定的设计问题，理解它们的适用场景对于编写可维护、可扩展的代码至关重要。

好的，我将使用 Mermaid 语法为 23 种设计模式绘制 UML 类图。这些图展示了每个模式的核心结构和关系。

创建型模式 (Creational Patterns)
1. 单例模式 (Singleton)
classDiagram
    class Singleton {
        - static instance: Singleton
        - Singleton()
        + static getInstance() Singleton
    }
    note for Singleton "确保一个类只有一个实例，并提供全局访问点"
一键获取完整项目代码
mermaid
1
2
3
4
5
6
7
2. 工厂方法模式 (Factory Method)
classDiagram
    class Creator {
        <<abstract>>
        + factoryMethod() Product
        + someOperation()
    }
    class ConcreteCreator {
        + factoryMethod() Product
    }
    class Product {
        <<interface>>
        + operation()
    }
    class ConcreteProduct {
        + operation()
    }
    
    Creator <|-- ConcreteCreator
    Product <|-- ConcreteProduct
    Creator --> Product
    note for Creator "让子类决定实例化哪个类"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
3. 抽象工厂模式 (Abstract Factory)
classDiagram
    class AbstractFactory {
        <<abstract>>
        + createProductA() AbstractProductA
        + createProductB() AbstractProductB
    }
    class ConcreteFactory1 {
        + createProductA() AbstractProductA
        + createProductB() AbstractProductB
    }
    class AbstractProductA {
        <<interface>>
    }
    class AbstractProductB {
        <<interface>>
    }
    class ProductA1
    class ProductB1
    
    AbstractFactory <|-- ConcreteFactory1
    AbstractProductA <|-- ProductA1
    AbstractProductB <|-- ProductB1
    ConcreteFactory1 --> ProductA1
    ConcreteFactory1 --> ProductB1
    note for AbstractFactory "创建相关对象的家族，不指定具体类"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
4. 建造者模式 (Builder)
classDiagram
    class Director {
        - builder: Builder
        + construct()
    }
    class Builder {
        <<interface>>
        + buildPartA()
        + buildPartB()
        + getResult() Product
    }
    class ConcreteBuilder {
        - product: Product
        + buildPartA()
        + buildPartB()
        + getResult() Product
    }
    class Product
    
    Director --> Builder
    Builder <|-- ConcreteBuilder
    ConcreteBuilder --> Product
    note for Director "分离复杂对象的构建与表示"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
5. 原型模式 (Prototype)
classDiagram
    class Prototype {
        <<interface>>
        + clone() Prototype
    }
    class ConcretePrototype {
        - field: String
        + clone() Prototype
    }
    
    Prototype <|-- ConcretePrototype
    note for Prototype "通过拷贝原型创建新对象"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
结构型模式 (Structural Patterns)
6. 适配器模式 (Adapter)
classDiagram
    class Target {
        <<interface>>
        + request()
    }
    class Adapter {
        - adaptee: Adaptee
        + request()
    }
    class Adaptee {
        + specificRequest()
    }
    
    Target <|-- Adapter
    Adapter --> Adaptee
    note for Adapter "将接口转换为客户端期望的接口"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
7. 桥接模式 (Bridge)
classDiagram
    class Abstraction {
        - implementor: Implementor
        + operation()
    }
    class RefinedAbstraction {
        + operation()
    }
    class Implementor {
        <<interface>>
        + operationImpl()
    }
    class ConcreteImplementorA {
        + operationImpl()
    }
    
    Abstraction <|-- RefinedAbstraction
    Abstraction --> Implementor
    Implementor <|-- ConcreteImplementorA
    note for Abstraction "将抽象与实现分离，使它们可以独立变化"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
8. 组合模式 (Composite)
classDiagram
    class Component {
        <<abstract>>
        + operation()
        + add(Component)
        + remove(Component)
        + getChild(int) Component
    }
    class Leaf {
        + operation()
    }
    class Composite {
        - children: List~Component~
        + operation()
        + add(Component)
        + remove(Component)
        + getChild(int) Component
    }
    
    Component <|-- Leaf
    Component <|-- Composite
    Composite --> Component
    note for Component "用树形结构表示部分-整体层次结构"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
9. 装饰器模式 (Decorator)
classDiagram
    class Component {
        <<interface>>
        + operation()
    }
    class ConcreteComponent {
        + operation()
    }
    class Decorator {
        - component: Component
        + operation()
    }
    class ConcreteDecorator {
        + operation()
        + addedBehavior()
    }
    
    Component <|-- ConcreteComponent
    Component <|-- Decorator
    Decorator --> Component
    Decorator <|-- ConcreteDecorator
    note for Decorator "动态地给对象添加职责"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
10. 外观模式 (Facade)
classDiagram
    class Facade {
        - subsystemA: SubsystemA
        - subsystemB: SubsystemB
        + operation()
    }
    class SubsystemA {
        + operationA()
    }
    class SubsystemB {
        + operationB()
    }
    
    Facade --> SubsystemA
    Facade --> SubsystemB
    note for Facade "为子系统提供统一的高层接口"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
11. 享元模式 (Flyweight)
classDiagram
    class FlyweightFactory {
        - flyweights: Map~String, Flyweight~
        + getFlyweight(key) Flyweight
    }
    class Flyweight {
        <<interface>>
        + operation(extrinsicState)
    }
    class ConcreteFlyweight {
        - intrinsicState: String
        + operation(extrinsicState)
    }
    
    FlyweightFactory --> Flyweight
    Flyweight <|-- ConcreteFlyweight
    note for FlyweightFactory "运用共享技术支持大量细粒度对象"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
12. 代理模式 (Proxy)
classDiagram
    class Subject {
        <<interface>>
        + request()
    }
    class RealSubject {
        + request()
    }
    class Proxy {
        - realSubject: RealSubject
        + request()
    }
    
    Subject <|-- RealSubject
    Subject <|-- Proxy
    Proxy --> RealSubject
    note for Proxy "为其他对象提供代理以控制访问"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
行为型模式 (Behavioral Patterns)
13. 责任链模式 (Chain of Responsibility)
classDiagram
    class Handler {
        <<abstract>>
        - successor: Handler
        + setSuccessor(Handler)
        + handleRequest()
    }
    class ConcreteHandler1 {
        + handleRequest()
    }
    class ConcreteHandler2 {
        + handleRequest()
    }
    
    Handler <|-- ConcreteHandler1
    Handler <|-- ConcreteHandler2
    Handler --> Handler
    note for Handler "让多个对象都有机会处理请求"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
14. 命令模式 (Command)
classDiagram
    class Invoker {
        - command: Command
        + setCommand(Command)
        + executeCommand()
    }
    class Command {
        <<interface>>
        + execute()
    }
    class ConcreteCommand {
        - receiver: Receiver
        + execute()
    }
    class Receiver {
        + action()
    }
    
    Invoker --> Command
    Command <|-- ConcreteCommand
    ConcreteCommand --> Receiver
    note for Invoker "将请求封装为对象"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
15. 解释器模式 (Interpreter)
classDiagram
    class AbstractExpression {
        <<abstract>>
        + interpret(Context)
    }
    class TerminalExpression {
        + interpret(Context)
    }
    class NonterminalExpression {
        - expression: AbstractExpression
        + interpret(Context)
    }
    class Context
    
    AbstractExpression <|-- TerminalExpression
    AbstractExpression <|-- NonterminalExpression
    NonterminalExpression --> AbstractExpression
    note for AbstractExpression "定义语言的文法表示"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
16. 迭代器模式 (Iterator)
classDiagram
    class Aggregate {
        <<interface>>
        + createIterator() Iterator
    }
    class ConcreteAggregate {
        + createIterator() Iterator
    }
    class Iterator {
        <<interface>>
        + first()
        + next()
        + isDone() boolean
        + currentItem() Object
    }
    class ConcreteIterator {
        - aggregate: ConcreteAggregate
        + first()
        + next()
        + isDone() boolean
        + currentItem() Object
    }
    
    Aggregate <|-- ConcreteAggregate
    Iterator <|-- ConcreteIterator
    ConcreteAggregate --> ConcreteIterator
    ConcreteIterator --> ConcreteAggregate
    note for Aggregate "顺序访问聚合对象的元素"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
17. 中介者模式 (Mediator)
classDiagram
    class Mediator {
        <<interface>>
        + notify(sender, event)
    }
    class ConcreteMediator {
        - component1: Component1
        - component2: Component2
        + notify(sender, event)
    }
    class BaseComponent {
        - mediator: Mediator
    }
    class Component1 {
        + doA()
    }
    class Component2 {
        + doB()
    }
    
    Mediator <|-- ConcreteMediator
    BaseComponent <|-- Component1
    BaseComponent <|-- Component2
    ConcreteMediator --> Component1
    ConcreteMediator --> Component2
    Component1 --> Mediator
    Component2 --> Mediator
    note for Mediator "封装对象间的交互"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
18. 备忘录模式 (Memento)
classDiagram
    class Originator {
        - state: String
        + createMemento() Memento
        + restoreMemento(Memento)
    }
    class Memento {
        - state: String
        + getState() String
        + setState(String)
    }
    class Caretaker {
        - memento: Memento
        + saveState(Memento)
        + restoreState() Memento
    }
    
    Originator --> Memento
    Caretaker --> Memento
    note for Originator "捕获并外部化对象的内部状态"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
19. 观察者模式 (Observer)
classDiagram
    class Subject {
        - observers: List~Observer~
        + attach(Observer)
        + detach(Observer)
        + notify()
    }
    class ConcreteSubject {
        - state: String
        + getState() String
        + setState(String)
    }
    class Observer {
        <<interface>>
        + update()
    }
    class ConcreteObserver {
        - subject: Subject
        + update()
    }
    
    Subject <|-- ConcreteSubject
    Observer <|-- ConcreteObserver
    Subject --> Observer
    ConcreteObserver --> ConcreteSubject
    note for Subject "定义对象间的一对多依赖"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
20. 状态模式 (State)
classDiagram
    class Context {
        - state: State
        + request()
        + setState(State)
    }
    class State {
        <<interface>>
        + handle()
    }
    class ConcreteStateA {
        + handle()
    }
    class ConcreteStateB {
        + handle()
    }
    
    Context --> State
    State <|-- ConcreteStateA
    State <|-- ConcreteStateB
    note for Context "允许对象在内部状态改变时改变行为"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
21. 策略模式 (Strategy)
classDiagram
    class Context {
        - strategy: Strategy
        + setStrategy(Strategy)
        + executeStrategy()
    }
    class Strategy {
        <<interface>>
        + execute()
    }
    class ConcreteStrategyA {
        + execute()
    }
    class ConcreteStrategyB {
        + execute()
    }
    
    Context --> Strategy
    Strategy <|-- ConcreteStrategyA
    Strategy <|-- ConcreteStrategyB
    note for Context "定义一系列可互换的算法"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22. 模板方法模式 (Template Method)
classDiagram
    class AbstractClass {
        <<abstract>>
        + templateMethod() [final]
        # primitiveOperation1() [abstract]
        # primitiveOperation2() [abstract]
    }
    class ConcreteClass {
        # primitiveOperation1()
        # primitiveOperation2()
    }
    
    AbstractClass <|-- ConcreteClass
    note for AbstractClass "定义算法骨架，子类重定义某些步骤"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
23. 访问者模式 (Visitor)
classDiagram
    class Visitor {
        <<interface>>
        + visitConcreteElementA(ConcreteElementA)
        + visitConcreteElementB(ConcreteElementB)
    }
    class ConcreteVisitor {
        + visitConcreteElementA(ConcreteElementA)
        + visitConcreteElementB(ConcreteElementB)
    }
    class Element {
        <<interface>>
        + accept(Visitor)
    }
    class ConcreteElementA {
        + accept(Visitor)
        + operationA()
    }
    class ConcreteElementB {
        + accept(Visitor)
        + operationB()
    }
    
    Visitor <|-- ConcreteVisitor
    Element <|-- ConcreteElementA
    Element <|-- ConcreteElementB
    ConcreteVisitor --> ConcreteElementA
    ConcreteVisitor --> ConcreteElementB
    ConcreteElementA --> Visitor
    ConcreteElementB --> Visitor
    note for Visitor "在不改变类的前提下定义新操作"
一键获取完整项目代码
mermaid

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
这些 Mermaid UML 图展示了 23 种设计模式的核心结构和关系。每个图都突出了该模式的关键特征，帮助你直观理解各个设计模式的实现方式。

好的，这里为23种设计模式提供UML类图的核心结构描述。由于无法实际绘制图形，我将用文字和伪UML标记来描述每个模式的关键组成部分和关系。

创建型模式
1. 单例模式 (Singleton)
[Singleton]
- static instance: Singleton
- Singleton() [private]
+ static getInstance(): Singleton
一键获取完整项目代码
1
2
3
4
关系：自关联

2. 工厂方法模式 (Factory Method)
[Creator] <>----> [Product]
|                  ^
|                  |
[ConcreteCreator]  [ConcreteProduct]
+ factoryMethod(): Product
一键获取完整项目代码
1
2
3
4
5
关系：Creator与Product关联，ConcreteCreator继承Creator，ConcreteProduct继承Product

3. 抽象工厂模式 (Abstract Factory)
[AbstractFactory] <>----> [AbstractProductA]
|                         [AbstractProductB]
^                         ^
|                         |
[ConcreteFactory1] ----> [ProductA1]
                     ----> [ProductB1]
一键获取完整项目代码
1
2
3
4
5
6
4. 建造者模式 (Builder)
[Director] <>----> [Builder]
                    | [接口]
                    |
            [ConcreteBuilder] <>----> [Product]
一键获取完整项目代码
1
2
3
4
5. 原型模式 (Prototype)
[Prototype] <|-- [ConcretePrototype]
+ clone(): Prototype        + clone(): Prototype
一键获取完整项目代码
1
2
结构型模式
6. 适配器模式 (Adapter)
[Target] <|-- [Adapter] <>----> [Adaptee]
+ request()    + request()      + specificRequest()
一键获取完整项目代码
1
2
7. 桥接模式 (Bridge)
[Abstraction] <>----> [Implementor]
|                      ^ [接口]
|                      |
[RefinedAbstraction]   [ConcreteImplementorA]
一键获取完整项目代码
1
2
3
4
8. 组合模式 (Composite)
[Component] <|-- [Leaf]
|           <|-- [Composite]
           + operation()    + operation()
                           - children: List<Component>
一键获取完整项目代码
1
2
3
4
9. 装饰器模式 (Decorator)
[Component] <|-- [ConcreteComponent]
|           <|-- [Decorator] <>----> [Component]
                            |
                    [ConcreteDecorator]
一键获取完整项目代码
1
2
3
4
10. 外观模式 (Facade)
[Facade] <>----> [SubsystemA]
        <>----> [SubsystemB]
        <>----> [SubsystemC]
一键获取完整项目代码
1
2
3
11. 享元模式 (Flyweight)
[FlyweightFactory] <>----> [Flyweight]
                          ^ [接口]
                          |
                  [ConcreteFlyweight]
一键获取完整项目代码
1
2
3
4
12. 代理模式 (Proxy)
[Subject] <|-- [RealSubject]
|         <|-- [Proxy] <>----> [RealSubject]
一键获取完整项目代码
1
2
行为型模式
13. 责任链模式 (Chain of Responsibility)
[Handler] <>----> [Handler] [自关联]
| [抽象类]
|
[ConcreteHandlerA]
[ConcreteHandlerB]
一键获取完整项目代码
1
2
3
4
5
14. 命令模式 (Command)
[Invoker] <>----> [Command] <>----> [Receiver]
                   ^ [接口]
                   |
           [ConcreteCommand]
一键获取完整项目代码
1
2
3
4
15. 解释器模式 (Interpreter)
[AbstractExpression] <|-- [TerminalExpression]
|                    <|-- [NonterminalExpression]
                       - expressions: List<AbstractExpression>
一键获取完整项目代码
1
2
3
16. 迭代器模式 (Iterator)
[Aggregate] <>----> [Iterator]
| [接口]            ^ [接口]
|                  |
[ConcreteAggregate] [ConcreteIterator]
一键获取完整项目代码
1
2
3
4
17. 中介者模式 (Mediator)
[Mediator] <--> [Colleague] [抽象类]
^                ^
|                |
[ConcreteMediator] [ConcreteColleague1]
                 [ConcreteColleague2]
一键获取完整项目代码
1
2
3
4
5
18. 备忘录模式 (Memento)
[Originator] <>----> [Memento]
[CareTaker]  <>----> [Memento]
一键获取完整项目代码
1
2
19. 观察者模式 (Observer)
[Subject] <>----> [Observer]
|                  ^ [接口]
|                  |
[ConcreteSubject]  [ConcreteObserver]
一键获取完整项目代码
1
2
3
4
20. 状态模式 (State)
[Context] <>----> [State] [接口]
                   ^
                   |
           [ConcreteStateA]
           [ConcreteStateB]
一键获取完整项目代码
1
2
3
4
5
21. 策略模式 (Strategy)
[Context] <>----> [Strategy] [接口]
                   ^
                   |
           [ConcreteStrategyA]
           [ConcreteStrategyB]
一键获取完整项目代码
1
2
3
4
5
22. 模板方法模式 (Template Method)
[AbstractClass]
+ templateMethod() [final]
# primitiveOperation1() [abstract]
# primitiveOperation2() [abstract]
        ^
        |
[ConcreteClass]
一键获取完整项目代码
1
2
3
4
5
6
7
23. 访问者模式 (Visitor)
[Visitor] <--> [Element]
| [接口]       ^ [接口]
|             |
[ConcreteVisitor] [ConcreteElementA]
                [ConcreteElementB]
一键获取完整项目代码
1
2
3
4
5
