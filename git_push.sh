#!/bin/bash



#

# Configure Git for the first time 

#  $ git config --global user.email "y9_mochi@yahoo.co.jp"

#  $ git config --global user.name  "SAN_INV"

#



#

# ■ 管理で役立つコマンド集

#   ------------------------------

#   ◎ git addしたファイルの確認

#     → $ git status

#   ◎ git status時の「Mのフォルダを無視」

#     → $ git rm --cached -r

#   ◎ git addを取り消したい場合

#     → $ git restore --staged

#     # すべてのファイルのaddを取り消したい場合⭐️

#       → $ git reset

#  ------------------------------

#



readonly OPT_1="${1}" # オプション引数





function usage() {

cat <<-_EOT_

Usage:

  $0 [OPTIONS]

Description:

  Execute Git commands.

Options:

  -a, --all-exe     pull and push commands

  -p, --pull-only   only pull command

  -h, --help        display this help and exit

Note:



_EOT_

exit 1

}





function git_pull(){

#echo "■ git pull origin master" && \

#git pull origin master

echo "■ git status -s"          && \

git status -s

}





function git_push(){

cd `dirname $0` > /dev/null 2>&1                            && \

echo "■ git add -A . "                                      && \

git add -A .                                                && \

echo "■ git commit"                                         && \

git commit -m "REI commit `date '+%Y/%m/%d %H:%M:%S'`"  && \

echo "■ git push"                                           && \

git push -u origin main  # git pushコマンド実行

}

# オプション確認

case "${OPT_1}" in

-a|--all-exe)

git_pull && git_push

;;

-p|--pull-only)

git_pull

;;

*)

usage

;;

esac

exit 0
