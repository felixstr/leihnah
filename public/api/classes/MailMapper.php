<?php

class MailMapper {
	
	private $mailer = null;
	private $errorInfo = '';
	
	public static function factory($mailer) {
		return new MailMapper($mailer);
	}
	
	public function __construct($mailer) {
		
		$this->mailer = $mailer;
		$this->mailer->isHTML(true);
		$this->mailer->setFrom('mailer@leihnah.ch', 'leihnah.ch');
		
		return $this;
	}
		
	public function send() {
	    $result = true;
	    if (!$this->mailer->send()) {
		    $result = false;
		    $this->errorInfo = $this->mailer->errorInfo;
	    }
	    
	    return $result;

	}
	
	public function addAddress($address, $name) { $this->mailer->addAddress($address, $name); return $this; }
	public function setSubject($subject) { $this->mailer->Subject = $subject; return $this; }
	public function setBody($body) { $this->mailer->Body = $body; return $this; }
	
	public function getErrorInfo() { return $this->errorInfo; }
	
}