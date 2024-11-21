import os
import re
import logging
import sys

LOG = logging.getLogger('krets')
LOG.addHandler(logging.StreamHandler())
LOG.handlers[-1].setFormatter(logging.Formatter(logging.BASIC_FORMAT))
LOG.setLevel(logging.DEBUG)

version_re = re.compile("v(\d+).(\d+)(?:.(\d+))?")
files = ['blocks.js', 'index.html', 'service-worker.js']

def check_current_version():
    matches = set()
    for filename in files:
        with open(filename, 'r') as handle:
            for line in handle.readlines():
                for match in version_re.finditer(line):
                    matches.add(match.groups())
    if len(matches) == 1:
        return list(matches)[0]
    elif len(matches) > 1:
        LOG.warning("More than one version found: %s", matches)

def replace_version(old, new):
    for filename in files:
        temp = filename+'.swp'
        with open(filename, 'r') as handle:
            with open(temp, 'w') as out:
                for line in handle.readlines():
                    out.write(line.replace(old, new))
        os.rename(temp, filename)

def increment_version(version_tuple):
    parts = [int(_) for _ in list(version_tuple)]
    parts[-1] += 1
    return version_str(parts)

def version_str(parts):
    return f'v{".".join([str(_) for _ in parts])}'

def main():
    current_version = check_current_version()
    if current_version is None:
        LOG.error("Current version could not be determined.")
        sys.exit(1)
    next_version = increment_version(current_version)
    current_version = version_str(current_version)

    LOG.info("Current Version: %s", current_version)
    LOG.info("Next Version: %s", next_version)

    replace_version(current_version, next_version)


if __name__ == '__main__':
    main()