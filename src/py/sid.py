from requests import Request, session
from requests.exceptions import HTTPError
import sys

"""
    Handles getting an exchange code from a session id
    :param sid: session id
    :return: exchange code
    """
s = session()
s.headers.update({
    'X-Epic-Event-Action': 'login',
    'X-Epic-Event-Category': 'login',
    'X-Epic-Strategy-Flags': '',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'EpicGamesLauncher/10.19.2-14598295+++Portal+Release-Live '
    'UnrealEngine/4.23.0-14598295+++Portal+Release-Live '
    'Chrome/59.0.3071.15 Safari/537.36'
})

# get first set of cookies (EPIC_BEARER_TOKEN etc.)
_ = s.get('https://www.epicgames.com/id/api/set-sid',
          params=dict(sid=sys.argv[1]))
# get XSRF-TOKEN and EPIC_SESSION_AP cookie
_ = s.get('https://www.epicgames.com/id/api/csrf')
# finally, get the exchange code
r = s.post('https://www.epicgames.com/id/api/exchange/generate',
           headers={'X-XSRF-TOKEN': s.cookies['XSRF-TOKEN']})

if r.status_code == 200:
    code = r.json()['code']
    print('{"status": "SUCCESS","response": "' + str(r.json()).replace("'", '\\"') + '", "code": "' + code + '"}')
else:
    print('{"status": "ERROR", "response": "' + str(r.json()).replace("'", '\\"') + '"}')
