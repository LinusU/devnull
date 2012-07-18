#!/usr/local/bin/python3
"""
def output_xml(data):
    print("xml")

def output(data, format="xml"):
    globals()["output_" + format](data) 

output("hej")
"""

"""
done = False

def should(x):
    if globals()['done']:
        return False
    if (x % 2) == 1:
        globals()['done'] = True
        return False
    print(x)
    return True

def fn(li):
    globals()['done'] = False
    map(should, li)

fn([2,4,8,10,12,14,16,18,19,20,22,24])

"""

"""

def fn(s):
    return s[4:].reverse()

fn("abcdefghi")

"""

"""

def isPrime(n):
    if n < 2: return False
    if n == 2: return True
    if n % 2 == 0: return False
    for x in range(3, int(n**0.5)+1, 2):
        if n % x == 0: return False
    return True

def lrgPrime(n):
    for i in range(n-1, 2, -1):
        if ((float(n) / float(i)) % 1 == 0) and isPrime(i):
            return i
    return None

print lrgPrime(2**63-1)

"""





