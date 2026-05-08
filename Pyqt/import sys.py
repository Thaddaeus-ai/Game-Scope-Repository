import sys
from PyQt6 import uic
from PyQt6.QtWidgets import QApplication, QMainWindow


class Calc(QMainWindow):
    def __init__(self):
        super().__init__()
        uic.loadUi("calc.ui", self)

        self.buf = ""
        self.val = None
        self.op = None
        self.reset = False

        self._bind()
        self._show(0)

    def _bind(self):
        nums = ["9","8","7","5","6","4","3","2","1","0"]
        btns = [
            "pushButton","pushButton_2","pushButton_3","pushButton_4",
            "pushButton_5","pushButton_6","pushButton_9","pushButton_8",
            "pushButton_7","pushButton_10"
        ]

        for b, n in zip(btns, nums):
            getattr(self, b).clicked.connect(lambda _, x=n: self.digit(x))

        ops = {
            "pushButton_11": "+",
            "pushButton_12": "-",
            "pushButton_13": "/",
            "pushButton_14": "*"
        }

        for b, o in ops.items():
            getattr(self, b).clicked.connect(lambda _, x=o: self.set_op(x))

        self.pushButton_15.clicked.connect(self.solve)
        self.pushButton_16.clicked.connect(self.clear)

    def _show(self, v):
        if isinstance(v, float) and v.is_integer():
            v = int(v)
        self.lcdNumber.setDigitCount(12)
        self.lcdNumber.display(v)

    def digit(self, d):
        if self.reset:
            self.buf, self.reset = "", False
        self.buf += d
        self._show(float(self.buf))

    def set_op(self, o):
        if self.buf:
            self.calc() if self.op else setattr(self, "val", float(self.buf))
        self.op, self.buf = o, ""

    def solve(self):
        if self.op and self.buf:
            self.calc()
            self.op, self.reset = None, True

    def calc(self):
        try:
            a, b = self.val, float(self.buf)
            if self.op == "/" and b == 0:
                return self.err()

            res = {"+": a+b, "-": a-b, "*": a*b, "/": a/b}[self.op]
            self.val, self.buf = res, str(res)
            self._show(res)
        except:
            self.err()

    def err(self):
        self.lcdNumber.display("Err")
        self.clear()

    def clear(self):
        self.buf, self.val, self.op, self.reset = "", None, None, False
        self._show(0)


if _name_ == "_main_":
    app = QApplication(sys.argv)
    w = Calc()
    w.show()
    sys.exit(app.exec())